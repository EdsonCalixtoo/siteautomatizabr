const fs = require('fs');
const path = require('path');

// Paths to CSV files
const categoriesPath = path.join('C:', 'Users', 'Edson Calixto', 'Desktop', 'categories_rows.csv');
const subcategoriesPath = path.join('C:', 'Users', 'Edson Calixto', 'Desktop', 'subcategories_rows.csv');
const productsPath = path.join('C:', 'Users', 'Edson Calixto', 'Desktop', 'products_rows.csv');

function parseCSV(content) {
    const lines = content.split('\n');
    const header = lines[0].split(',');
    return lines.slice(1).filter(line => line.trim()).map(line => {
        // Simple CSV parser for standard rows, handles quotes basicly
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
            obj[key.trim()] = row[index];
        });
        return obj;
    });
}

async function migrate() {
    console.log('Lendo arquivos...');
    const categoriesData = fs.readFileSync(categoriesPath, 'utf8');
    const categories = parseCSV(categoriesData);
    const categoryMap = {};
    categories.forEach(c => { categoryMap[c.key] = c.name; });

    console.log('Processando produtos...');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const productsRows = parseCSV(productsData);

    let sql = `-- MIGRATION SCRIPT FOR PRODUCTS\n`;
    sql += `DO $$\nDECLARE\n    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);\nBEGIN\n`;
    sql += `    IF v_user_id IS NULL THEN\n        RAISE NOTICE 'Nenhum usuário encontrado em auth.users. Crie um usuário primeiro.';\n        RETURN;\n    END IF;\n\n`;

    productsRows.forEach(p => {
        if (!p.name) return;

        // Escape single quotes for SQL
        const escape = (str) => {
            if (!str) return 'NULL';
            return `'${str.replace(/'/g, "''")}'`;
        };

        // Features mapping: {a,b} -> ARRAY['a','b']
        let featuresSql = 'NULL';
        if (p.features && p.features.startsWith('{') && p.features.endsWith('}')) {
            const items = p.features.slice(1, -1).split(',').map(i => {
                let cleaned = i.trim();
                if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
                return `'${cleaned.replace(/'/g, "''")}'`;
            });
            featuresSql = `ARRAY[${items.join(', ')}]`;
        }

        // Images mapping
        let imagesSql = 'NULL';
        if (p.images && p.images.startsWith('{') && p.images.endsWith('}')) {
            const items = p.images.slice(1, -1).split(',').map(i => {
                let cleaned = i.trim();
                if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.slice(1, -1);
                return `'${cleaned.replace(/'/g, "''")}'`;
            });
            imagesSql = `ARRAY[${items.join(', ')}]`;
        } else if (p.image) {
          imagesSql = `ARRAY[${escape(p.image)}]`;
        }

        // Category/Subcategory mapping logic
        let finalCategory = p.category;
        if (p.category !== 'acessorio' && p.category !== 'completo') {
            // It's likely a vehicle slug, map to 'completo' or similar
            finalCategory = 'completo';
        }

        sql += `    INSERT INTO products (\n`;
        sql += `        name, description, short_description, category, subcategory, \n`;
        sql += `        price, original_price, stock, sku, weight, dimensions, \n`;
        sql += `        warranty, material, status, badge, video_url, audio_url, \n`;
        sql += `        image, images, features, user_id\n`;
        sql += `    ) VALUES (\n`;
        sql += `        ${escape(p.name)}, ${escape(p.description)}, ${escape(p.short_description)}, ${escape(finalCategory)}, ${escape(p.subcategory)},\n`;
        sql += `        ${p.price || 0}, ${p.original_price || 'NULL'}, ${p.stock || 0}, ${escape(p.sku)}, ${escape(p.weight)}, ${escape(p.dimensions)},\n`;
        sql += `        ${escape(p.warranty)}, ${escape(p.material)}, ${escape(p.status || 'ativo')}, ${escape(p.badge)}, ${escape(p.video_url)}, ${escape(p.audio_url)},\n`;
        sql += `        ${escape(p.image)}, ${imagesSql}, ${featuresSql}, v_user_id\n`;
        sql += `    ) ON CONFLICT (name) DO NOTHING; -- Evitar duplicados se rodar 2x\n\n`;
    });

    sql += `END $$;`;

    fs.writeFileSync('MIGRATION_PRODUCTS.sql', sql);
    console.log('Sucesso! O arquivo MIGRATION_PRODUCTS.sql foi gerado com todos os produtos.');
}

migrate().catch(err => {
    console.error('Erro na migração:', err);
});
