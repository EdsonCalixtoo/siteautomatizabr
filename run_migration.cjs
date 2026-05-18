const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// =========================================================================
// ⚙️ CREDENTIALS LOADER
// =========================================================================
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(line => {
        const urlMatch = line.match(/^\s*VITE_SUPABASE_URL\s*=\s*(.*?)\s*$/);
        const keyMatch = line.match(/^\s*VITE_SUPABASE_ANON_KEY\s*=\s*(.*?)\s*$/);
        if (urlMatch) SUPABASE_URL = urlMatch[1].trim().replace(/^['"]|['"]$/g, '');
        if (keyMatch) SUPABASE_ANON_KEY = keyMatch[1].trim().replace(/^['"]|['"]$/g, '');
    });
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('❌ ERROR: Could not read credentials from .env file!');
    process.exit(1);
}

console.log(`📡 Connecting to Supabase: ${SUPABASE_URL}`);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =========================================================================
// 🔀 BULK CSV PARSER WITH MULTILINE SUPPORT
// =========================================================================
function parseCSV(content) {
    if (!content) return [];
    const lines = [];
    let inQuotes = false;
    let currentLine = '';
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        if (char === '"') {
            inQuotes = !inQuotes;
            currentLine += char;
        } else if (char === '\n' && !inQuotes) {
            lines.push(currentLine);
            currentLine = '';
        } else {
            currentLine += char;
        }
    }
    if (currentLine) lines.push(currentLine);

    if (lines.length === 0) return [];
    const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const row = [];
        let inQuotes = false;
        let currentValue = '';
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
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
            obj[key] = (val === 'NULL' || val === '' || val === undefined) ? null : val;
        });
        return obj;
    });
}

const parseArray = (str) => {
    if (!str) return [];
    if (!str.startsWith('{') || !str.endsWith('}')) {
        return str ? [str] : [];
    }
    return str.slice(1, -1).split(',').map(i => i.trim().replace(/^"|"$/g, ''));
};

async function run() {
    console.log('\n🚀 Starting Local Data Migration to the New Supabase...');

    // 1. MIGRATE CATEGORIES
    const categoriesPath = path.join(__dirname, 'categories_rows.csv');
    if (fs.existsSync(categoriesPath)) {
        console.log('📂 Loading and inserting categories...');
        const cats = parseCSV(fs.readFileSync(categoriesPath, 'utf8'));
        for (const cat of cats) {
            if (!cat.name || !cat.id) continue;
            const { error } = await supabase.from('categories').upsert({
                id: cat.id,
                name: cat.name,
                key: cat.key,
                user_id: null
            }, { onConflict: 'id' });
            
            if (error) {
                console.error(`   ❌ Error in category [${cat.name}]: ${error.message}`);
            } else {
                console.log(`   ✅ Category [${cat.name}] migrated.`);
            }
        }
    } else {
        console.log('⚠️ categories_rows.csv not found.');
    }

    // 2. MIGRATE SUBCATEGORIES
    const subcategoriesPath = path.join(__dirname, 'subcategories_rows.csv');
    if (fs.existsSync(subcategoriesPath)) {
        console.log('\n📂 Loading and inserting subcategories...');
        const subs = parseCSV(fs.readFileSync(subcategoriesPath, 'utf8'));
        for (const sub of subs) {
            if (!sub.name || !sub.id) continue;
            const { error } = await supabase.from('subcategories').upsert({
                id: sub.id,
                category_id: sub.category_id,
                name: sub.name,
                user_id: null
            }, { onConflict: 'id' });
            
            if (error) {
                console.error(`   ❌ Error in subcategory [${sub.name}]: ${error.message}`);
            } else {
                console.log(`   ✅ Subcategory [${sub.name}] migrated.`);
            }
        }
    } else {
        console.log('⚠️ subcategories_rows.csv not found.');
    }

    // 3. MIGRATE PRODUCTS
    const productsPath = path.join(__dirname, 'products_rows.csv');
    if (fs.existsSync(productsPath)) {
        console.log('\n📦 Loading and inserting products (this might take a few seconds due to base64 images)...');
        const prods = parseCSV(fs.readFileSync(productsPath, 'utf8'));
        
        for (const p of prods) {
            if (!p.name || !p.id) continue;
            
            const features = parseArray(p.features);
            let images = parseArray(p.images);
            if (images.length === 0 && p.image) images = [p.image];

            const { error } = await supabase.from('products').upsert({
                id: p.id,
                name: p.name,
                description: p.description || '',
                short_description: p.short_description || '',
                category: p.category || 'completo',
                subcategory: p.subcategory || '',
                price: parseFloat(p.price || 0),
                original_price: p.original_price ? parseFloat(p.original_price) : null,
                image: p.image || null,
                images: images,
                features: features,
                stock: parseInt(p.stock || 0),
                sku: p.sku || `SKU-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                status: p.status || 'ativo',
                weight: p.weight || null,
                dimensions: p.dimensions || null,
                warranty: p.warranty || '',
                material: p.material || '',
                badge: p.badge || null,
                video_url: p.video_url || null,
                audio_url: p.audio_url || null,
                user_id: null
            }, { onConflict: 'id' });
            
            if (error) {
                console.error(`   ❌ Error in product [${p.name}]: ${error.message}`);
            } else {
                console.log(`   ✅ Product [${p.name}] migrated successfully.`);
            }
        }
    } else {
        console.log('⚠️ products_rows.csv not found.');
    }

    console.log('\n🎉 Local data upload finished!');
    console.log('👉 Remember to re-enable Row Level Security (RLS) in the SQL Editor to keep your database secure!');
}

run().catch(console.error);
