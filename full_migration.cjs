const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://amcygyicgudasfwwhmea.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3lneWljZ3VkYXNmd3dobWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk2NDkzMCwiZXhwIjoyMDkwNTQwOTMwfQ.vOSFZSMjn8z1DzKsPHFgJwfAjv1XEq7cwuSR7CJzumk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const desktopPath = path.join('C:', 'Users', 'Edson Calixto', 'Desktop');

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
    console.log('--- Iniciando Migração Completa (Categorias -> Subcategorias -> Produtos) ---');

    // 1. Obter User ID
    const { data: profile } = await supabase.from('seller_profiles').select('id').limit(1);
    let userId = profile && profile[0] ? profile[0].id : null;
    if (!userId) {
        const { data: auth } = await supabase.auth.admin.listUsers();
        userId = auth.users[0] ? auth.users[0].id : null;
    }
    console.log('User ID:', userId);

    // 2. Migrar Categorias
    console.log('Migrando categorias...');
    const catData = fs.readFileSync(path.join(desktopPath, 'categories_rows.csv'), 'utf8');
    const cats = parseCSV(catData);
    for (const cat of cats) {
        if (!cat.name) continue;
        await supabase.from('categories').upsert({
            id: cat.id,
            name: cat.name,
            key: cat.key,
            user_id: userId
        }, { onConflict: 'id' });
    }
    console.log(`${cats.length} categorias processadas.`);

    // 3. Migrar Subcategorias
    console.log('Migrando subcategorias...');
    const subData = fs.readFileSync(path.join(desktopPath, 'subcategories_rows.csv'), 'utf8');
    const subs = parseCSV(subData);
    for (const sub of subs) {
        if (!sub.name) continue;
        await supabase.from('subcategories').upsert({
            id: sub.id,
            category_id: sub.category_id,
            name: sub.name,
            user_id: userId
        }, { onConflict: 'id' });
    }
    console.log(`${subs.length} subcategorias processadas.`);

    // 4. Migrar Produtos
    console.log('Migrando produtos...');
    const prodData = fs.readFileSync(path.join(desktopPath, 'products_rows.csv'), 'utf8');
    const prods = parseCSV(prodData);
    
    // Mapeamento de IDs para nomes para manter consistência no campo de texto
    const catMap = {};
    cats.forEach(c => catMap[c.id] = c.key);

    for (const p of prods) {
        if (!p.name) continue;
        
        const parseArray = (str) => {
            if (!str || !str.startsWith('{')) return [];
            return str.slice(1, -1).split(',').map(i => i.trim().replace(/^"|"$/g, ''));
        };

        const features = parseArray(p.features);
        let images = parseArray(p.images);
        if (images.length === 0 && p.image) images = [p.image];

        // Determinar a categoria (slug)
        let categorySlug = p.category; // Valor do CSV
        // Tentar buscar se for UUID
        if (catMap[p.category_id]) {
            categorySlug = catMap[p.category_id];
        }

        await supabase.from('products').upsert({
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
    }
    console.log(`${prods.length} produtos processados.`);
    console.log('--- Migração Concluída! ---');
}

run().catch(console.error);
