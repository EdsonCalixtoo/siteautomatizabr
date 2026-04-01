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
    const logFile = fs.createWriteStream('migration_debug.log');
    logFile.write('Iniciando...\n');

    const prodData = fs.readFileSync(path.join(desktopPath, 'products_rows.csv'), 'utf8');
    const prods = parseCSV(prodData);

    for (const p of prods) {
        if (!p.name) continue;

        const { error } = await supabase.from('products').upsert({
            name: p.name,
            description: p.description || '',
            short_description: p.short_description || '',
            category: p.category || 'completo',
            subcategory: p.subcategory || '',
            price: parseFloat(p.price || 0),
            image: p.image || null,
            status: 'ativo',
            user_id: null // Testar com NULL já que os existentes são NULL
        }, { onConflict: 'name' });

        if (error) {
            logFile.write(`❌ Erro em ${p.name}: ${error.message} - ${error.code}\n`);
        } else {
            logFile.write(`✅ Sucesso: ${p.name}\n`);
        }
    }
    logFile.end();
}

run();
