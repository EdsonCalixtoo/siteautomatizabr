const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos de entrada no workspace
const setupPath = path.join(__dirname, 'SUPABASE_SETUP.sql');
const patchPath = path.join(__dirname, 'MIGRATION_AUTOMATIZA_FINAL.sql');
const categoriesPath = path.join(__dirname, 'categories_rows.csv');
const subcategoriesPath = path.join(__dirname, 'subcategories_rows.csv');
const productsPath = path.join(__dirname, 'products_rows.csv');

// Arquivo de saída
const outputPath = path.join(__dirname, 'MASTER_MIGRATION.sql');

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

function escapeSQLString(str) {
    if (str === null || str === undefined) return 'NULL';
    return `'${str.replace(/'/g, "''")}'`;
}

async function main() {
    console.log('📚 Lendo arquivos de configuração de banco de dados...');
    let setupSql = fs.readFileSync(setupPath, 'utf8');
    
    // Remover comentários desnecessários ou instruções do final do setup
    setupSql = setupSql.split('-- INSTRUÇÕES DE USO')[0];

    console.log('📂 Lendo estrutura de categorias e subcategorias...');
    let patchSql = fs.readFileSync(patchPath, 'utf8');
    
    // Queremos apenas as tabelas e políticas do patch, não o bloco DO $$ que semeia as categorias padrões
    // porque vamos semear as categorias REAIS do arquivo CSV!
    const patchHeader = patchSql.split('-- 5. SEMEAR CATEGORIAS ATUAIS')[0];

    let sql = `-- ========================================================\n`;
    sql += `-- 🚀 MASTER MIGRATION SCRIPT FOR NEW SUPABASE DATABASE\n`;
    sql += `-- Gerado automaticamente para restaurar tabelas e dados\n`;
    sql += `-- ========================================================\n\n`;

    sql += `-- 1. CRIAÇÃO DE TABELAS BASE E ESTRUTURA RLS\n`;
    sql += setupSql;
    sql += `\n\n-- 2. AJUSTES DE PEDIDOS E TABELAS DE CATEGORIAS DINÂMICAS\n`;
    sql += patchHeader;
    sql += `\n\n-- 3. SEMEANDO DADOS (CATEGORIAS -> SUBCATEGORIAS -> PRODUTOS)\n`;
    sql += `DO $$\nDECLARE\n    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);\nBEGIN\n`;
    sql += `    IF v_user_id IS NULL THEN\n`;
    sql += `        RAISE NOTICE '⚠️ Nenhum usuário encontrado em auth.users. Os dados serão cadastrados sem associação a um usuário admin.';\n`;
    sql += `    END IF;\n\n`;

    // A. Inserir Categorias
    if (fs.existsSync(categoriesPath)) {
        console.log('Migrando categorias...');
        const categories = parseCSV(fs.readFileSync(categoriesPath, 'utf8'));
        sql += `    -- Inserindo Categorias\n`;
        categories.forEach(c => {
            if (!c.name) return;
            sql += `    INSERT INTO public.categories (id, name, "key", user_id) \n`;
            sql += `    VALUES ('${c.id}', ${escapeSQLString(c.name)}, ${escapeSQLString(c.key)}, v_user_id)\n`;
            sql += `    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, "key" = EXCLUDED.key;\n\n`;
        });
    }

    // B. Inserir Subcategorias
    if (fs.existsSync(subcategoriesPath)) {
        console.log('Migrando subcategorias...');
        const subcategories = parseCSV(fs.readFileSync(subcategoriesPath, 'utf8'));
        sql += `    -- Inserindo Subcategorias\n`;
        subcategories.forEach(s => {
            if (!s.name) return;
            sql += `    INSERT INTO public.subcategories (id, category_id, name, user_id) \n`;
            sql += `    VALUES ('${s.id}', '${s.category_id}', ${escapeSQLString(s.name)}, v_user_id)\n`;
            sql += `    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;\n\n`;
        });
    }

    // C. Inserir Produtos
    if (fs.existsSync(productsPath)) {
        console.log('Migrando produtos...');
        const products = parseCSV(fs.readFileSync(productsPath, 'utf8'));
        sql += `    -- Inserindo Produtos\n`;
        
        // Mapeamento de IDs para chaves de categorias
        const categories = parseCSV(fs.readFileSync(categoriesPath, 'utf8'));
        const catMap = {};
        categories.forEach(c => catMap[c.id] = c.key);

        products.forEach(p => {
            if (!p.name) return;

            const parseArray = (str) => {
                if (!str || !str.startsWith('{')) return 'NULL';
                const items = str.slice(1, -1).split(',').map(i => {
                    let cleaned = i.trim();
                    if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
                    return `'${cleaned.replace(/'/g, "''")}'`;
                });
                return `ARRAY[${items.join(', ')}]`;
            };

            const featuresSql = parseArray(p.features);
            let imagesSql = parseArray(p.images);
            if (imagesSql === 'NULL' && p.image) {
                imagesSql = `ARRAY[${escapeSQLString(p.image)}]`;
            }

            let categorySlug = p.category;
            if (catMap[p.category_id]) {
                categorySlug = catMap[p.category_id];
            } else if (p.category !== 'acessorio' && p.category !== 'completo') {
                categorySlug = 'completo';
            }

            sql += `    INSERT INTO public.products (\n`;
            sql += `        name, description, short_description, category, subcategory, \n`;
            sql += `        price, original_price, stock, sku, weight, dimensions, \n`;
            sql += `        warranty, material, status, badge, video_url, audio_url, \n`;
            sql += `        image, images, features, user_id\n`;
            sql += `    ) VALUES (\n`;
            sql += `        ${escapeSQLString(p.name)}, ${escapeSQLString(p.description)}, ${escapeSQLString(p.short_description)}, ${escapeSQLString(categorySlug)}, ${escapeSQLString(p.subcategory)},\n`;
            sql += `        ${p.price || 0}, ${p.original_price || 'NULL'}, ${p.stock || 0}, ${escapeSQLString(p.sku)}, ${escapeSQLString(p.weight)}, ${escapeSQLString(p.dimensions)},\n`;
            sql += `        ${escapeSQLString(p.warranty)}, ${escapeSQLString(p.material)}, ${escapeSQLString(p.status || 'ativo')}, ${escapeSQLString(p.badge)}, ${escapeSQLString(p.video_url)}, ${escapeSQLString(p.audio_url)},\n`;
            sql += `        ${escapeSQLString(p.image)}, ${imagesSql}, ${featuresSql}, v_user_id\n`;
            sql += `    ) ON CONFLICT (name) DO NOTHING;\n\n`;
        });
    }

    sql += `    RAISE NOTICE '✅ MIGRATION COMPLETED SUCCESSFULLY!';\n`;
    sql += `END $$;`;

    fs.writeFileSync(outputPath, sql);
    console.log('🎉 SUCESSO! O arquivo MASTER_MIGRATION.sql foi compilado com êxito!');
}

main().catch(console.error);
