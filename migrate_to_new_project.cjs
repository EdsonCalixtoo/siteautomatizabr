const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// =========================================================================
// ⚙️ CONFIGURAÇÃO DE CREDENCIAIS (Lê automaticamente do seu arquivo .env)
// =========================================================================
let NEW_SUPABASE_URL = '';
let NEW_SUPABASE_SERVICE_ROLE_KEY = '';

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
        const urlMatch = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*(.*?)\s*$/);
        const keyMatch = line.match(/^\s*SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*?)\s*$/);
        if (urlMatch) NEW_SUPABASE_URL = urlMatch[1].trim().replace(/^['"]|['"]$/g, '');
        if (keyMatch) NEW_SUPABASE_SERVICE_ROLE_KEY = keyMatch[1].trim().replace(/^['"]|['"]$/g, '');
    });
}

if (!NEW_SUPABASE_URL || !NEW_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ ERRO: Não foi possível ler as credenciais do seu novo projeto!');
    console.error('👉 Certifique-se de que configurou VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no seu arquivo .env');
    process.exit(1);
}

const supabase = createClient(NEW_SUPABASE_URL, NEW_SUPABASE_SERVICE_ROLE_KEY);

// Paths dos CSVs no mesmo diretório deste script
const categoriesPath = path.join(__dirname, 'categories_rows.csv');
const subcategoriesPath = path.join(__dirname, 'subcategories_rows.csv');
const productsPath = path.join(__dirname, 'products_rows.csv');

function parseCSV(content) {
    if (!content) return [];
    const lines = content.split('\n');
    const header = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const row = [];
        let inQuotes = false;
        let currentValue = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                row.push(currentValue.trim());
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        row.push(currentValue.trim());
        
        const obj = {};
        header.forEach((key, index) => {
            let val = row[index];
            if (val && val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[key] = val || null;
        });
        return obj;
    });
}

async function run() {
    console.log('🚀 Iniciando Migração Completa para o Novo Supabase...');

    // 1. Obter primeiro usuário Admin (se houver) em auth.users
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('⚠️ Erro ao listar usuários de autenticação:', listError.message);
    }
    let userId = authUsers && authUsers.users[0] ? authUsers.users[0].id : null;
    
    if (!userId) {
        console.log('⚠️ Nenhum usuário encontrado no sistema de autenticação (auth.users) do novo projeto.');
        console.log('👉 Recomendação: Acesse o site no navegador, crie uma conta admin, e depois execute este script novamente para associar os produtos ao seu usuário.');
        console.log('Inserindo registros sem vincular ID específico...');
    } else {
        console.log(`✅ Usuário administrador encontrado no banco: ${userId}`);
    }

    // 2. Migrar Categorias
    console.log('📂 Migrando categorias...');
    if (fs.existsSync(categoriesPath)) {
        const catData = fs.readFileSync(categoriesPath, 'utf8');
        const cats = parseCSV(catData);
        for (const cat of cats) {
            if (!cat.name) continue;
            const { error } = await supabase.from('categories').upsert({
                id: cat.id,
                name: cat.name,
                key: cat.key,
                user_id: userId
            }, { onConflict: 'id' });
            if (error) console.error(`❌ Erro na categoria ${cat.name}:`, error.message);
        }
        console.log(`✅ ${cats.length} categorias processadas.`);
    } else {
        console.log('⚠️ Arquivo categories_rows.csv não encontrado no diretório do projeto.');
    }

    // 3. Migrar Subcategorias
    console.log('📂 Migrando subcategorias...');
    if (fs.existsSync(subcategoriesPath)) {
        const subData = fs.readFileSync(subcategoriesPath, 'utf8');
        const subs = parseCSV(subData);
        for (const sub of subs) {
            if (!sub.name) continue;
            const { error } = await supabase.from('subcategories').upsert({
                id: sub.id,
                category_id: sub.category_id,
                name: sub.name,
                user_id: userId
            }, { onConflict: 'id' });
            if (error) console.error(`❌ Erro na subcategoria ${sub.name}:`, error.message);
        }
        console.log(`✅ ${subs.length} subcategorias processadas.`);
    } else {
        console.log('⚠️ Arquivo subcategories_rows.csv não encontrado no diretório do projeto.');
    }

    // 4. Migrar Produtos
    console.log('📦 Migrando produtos...');
    if (fs.existsSync(productsPath)) {
        const prodData = fs.readFileSync(productsPath, 'utf8');
        const prods = parseCSV(prodData);
        
        // Mapear IDs para keys das categorias no banco
        const { data: dbCats } = await supabase.from('categories').select('id, key');
        const catMap = {};
        if (dbCats) dbCats.forEach(c => catMap[c.id] = c.key);

        for (const p of prods) {
            if (!p.name) continue;
            
            const parseArray = (str) => {
                if (!str || !str.startsWith('{')) return [];
                return str.slice(1, -1).split(',').map(i => i.trim().replace(/^"|"$/g, ''));
            };

            const features = parseArray(p.features);
            let images = parseArray(p.images);
            if (images.length === 0 && p.image) images = [p.image];

            let categorySlug = p.category;
            if (catMap[p.category_id]) {
                categorySlug = catMap[p.category_id];
            }

            const { error } = await supabase.from('products').upsert({
                name: p.name,
                description: p.description || '',
                short_description: p.short_description || '',
                category: categorySlug || 'completo',
                subcategory: p.subcategory || '',
                price: parseFloat(p.price || 0),
                image: p.image || null,
                images: images,
                features: features,
                stock: parseInt(p.stock || 0),
                sku: p.sku || `SKU-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                status: 'ativo',
                user_id: userId
            }, { onConflict: 'name' });
            if (error) console.error(`❌ Erro no produto ${p.name}:`, error.message);
        }
        console.log(`✅ ${prods.length} produtos processados.`);
    } else {
        console.log('⚠️ Arquivo products_rows.csv não encontrado no diretório do projeto.');
    }

    console.log('🎉 Migração concluída com sucesso! Verifique seu banco de dados.');
}

run().catch(console.error);
