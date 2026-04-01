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
    console.log('--- Iniciando Migração Verbosa ---');

    const { data: users } = await supabase.auth.admin.listUsers();
    const userId = users.users[0].id;
    console.log('Usando User ID:', userId);

    console.log('Lendo CSV...');
    const prodData = fs.readFileSync(path.join(desktopPath, 'products_rows.csv'), 'utf8');
    const prods = parseCSV(prodData);
    console.log(`Linhas para processar: ${prods.length}`);

    for (let i=0; i < prods.length; i++) {
        const p = prods[i];
        if (!p.name) {
            console.log(`Pulando linha ${i+2} (sem nome)`);
            continue;
        }

        const parseArray = (str) => {
            if (!str || !str.startsWith('{')) return [];
            return str.slice(1, -1).split(',').map(item => item.trim().replace(/^"|"$/g, ''));
        };

        const features = parseArray(p.features);
        let images = parseArray(p.images);
        if (images.length === 0 && p.image) images = [p.image];

        const payload = {
            name: p.name,
            description: p.description || '',
            short_description: p.short_description || '',
            category: p.category || 'completo',
            subcategory: p.subcategory || '',
            price: parseFloat(p.price || 0),
            image: p.image || null,
            images: images,
            features: features,
            stock: parseInt(p.stock || 0),
            sku: p.sku || `SKU-${Date.now()}-${i}`,
            status: 'ativo',
            user_id: userId
        };

        console.log(`Tentando inserir ${i+1}/${prods.length}: ${p.name}`);
        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'name' });
        
        if (error) {
            console.error(`❌ ERRO em "${p.name}":`, error.message);
        } else {
            console.log(`✅ SUCESSO: ${p.name}`);
        }
    }
    console.log('--- Fim da Migração ---');
}

run();
