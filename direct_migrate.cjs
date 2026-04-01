const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://amcygyicgudasfwwhmea.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3lneWljZ3VkYXNmd3dobWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk2NDkzMCwiZXhwIjoyMDkwNTQwOTMwfQ.vOSFZSMjn8z1DzKsPHFgJwfAjv1XEq7cwuSR7CJzumk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const productsPath = path.join('C:', 'Users', 'Edson Calixto', 'Desktop', 'products_rows.csv');

function parseCSV(content) {
    const lines = content.split('\n');
    const header = lines[0].split(',');
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
            const cleanKey = key.trim();
            let val = row[index];
            if (val && val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            obj[cleanKey] = val;
        });
        return obj;
    });
}

async function run() {
    console.log('--- Iniciando Migração Direta ---');
    
    // 1. Obter o User ID
    console.log('Buscando usuário administrador...');
    const { data: users, error: userError } = await supabase.from('seller_profiles').select('id').limit(1);
    // Tentar seller_profiles ou buscar direto do auth se possível
    let targetUserId;
    if (users && users.length > 0) {
        targetUserId = users[0].id;
    } else {
        // Fallback: tentar pegar do auth via RPC ou assumir um ID manual se necessário.
        // Como o script de setup cria perfis, vamos usar o auth.users via admin.
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        if (authUsers && authUsers.users.length > 0) {
            targetUserId = authUsers.users[0].id;
        }
    }

    if (!targetUserId) {
        console.error('Erro: Nenhum usuário encontrado para associar os produtos.');
        return;
    }
    console.log(`Produtos serão associados ao usuário: ${targetUserId}`);

    // 2. Ler CSV
    console.log('Lendo CSV de produtos...');
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const productsRows = parseCSV(productsData);
    console.log(`${productsRows.length} produtos encontrados no CSV.`);

    // 3. Processar e Inserir
    for (const p of productsRows) {
        if (!p.name) continue;

        console.log(`Migrando: ${p.name}`);

        // Mapear arrays (features e images)
        const parseArray = (str) => {
            if (!str || !str.startsWith('{')) return null;
            return str.slice(1, -1).split(',').map(i => {
                let s = i.trim();
                if (s.startsWith('"') && s.endsWith('"')) s = s.slice(1, -1);
                return s;
            });
        };

        const features = parseArray(p.features);
        let images = parseArray(p.images);
        if (!images && p.image) images = [p.image];

        let finalCategory = p.category;
        if (p.category !== 'acessorio' && p.category !== 'completo') {
            finalCategory = 'completo';
        }

        const productToInsert = {
            name: p.name,
            description: p.description || '',
            short_description: p.short_description || '',
            category: finalCategory,
            subcategory: p.subcategory || '',
            price: parseFloat(p.price || 0),
            original_price: p.original_price ? parseFloat(p.original_price) : null,
            stock: parseInt(p.stock || 0),
            sku: p.sku || `SKU-${Date.now()}-${Math.floor(Math.random()*1000)}`,
            weight: p.weight || null,
            dimensions: p.dimensions || null,
            warranty: p.warranty || '',
            material: p.material || '',
            status: p.status || 'ativo',
            badge: p.badge || null,
            video_url: p.video_url || null,
            audio_url: p.audio_url || null,
            image: p.image || null,
            images: images,
            features: features,
            user_id: targetUserId
        };

        const { error: insertError } = await supabase
            .from('products')
            .upsert(productToInsert, { onConflict: 'name' });

        if (insertError) {
            console.error(`Erro ao inserir ${p.name}:`, insertError.message);
        }
    }

    console.log('--- Migração Concluída com Sucesso! ---');
}

run().catch(console.error);
