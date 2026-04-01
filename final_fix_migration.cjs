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
    console.log('--- Migração Final Corrigida ---');
    const prodData = fs.readFileSync(path.join(desktopPath, 'products_rows.csv'), 'utf8');
    const prods = parseCSV(prodData);

    for (const p of prods) {
        if (!p.name || !p.id) continue;

        const parseArray = (str) => {
            if (!str || !str.startsWith('{')) return [];
            return str.slice(1, -1).split(',').map(i => i.trim().replace(/^"|"$/g, ''));
        };

        const features = parseArray(p.features);
        let images = parseArray(p.images);
        if (images.length === 0 && p.image) images = [p.image];

        // Mapeamento correto de categoria baseada no key do CSV se possível
        let category = p.category;
        if (category === '012f0c40-3d8f-4bb6-8fb6-0cb28f56b215') category = 'peugeot-boxer';
        if (category === '72b75ec1-b0c1-47dc-b14a-5a4812f53870') category = 'fiat-ducato';

        const payload = {
            id: p.id,
            name: p.name,
            description: p.description || '',
            short_description: p.short_description || '',
            category: category || 'completo',
            subcategory: p.subcategory || '',
            price: parseFloat(p.price || 0),
            stock: parseInt(p.stock || 0),
            sku: p.sku || `SKU-${Math.floor(Math.random()*100000)}`,
            image: p.image || null,
            images: images,
            features: features,
            status: 'ativo',
            user_id: null // Mantendo null como no banco atual
        };

        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
        if (error) {
            console.error(`Erro: ${p.name} -> ${error.message}`);
        } else {
            console.log(`✅ Inserido: ${p.name}`);
        }
    }
    console.log('--- FIM ---');
}

run();
