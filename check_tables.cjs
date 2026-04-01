const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://amcygyicgudasfwwhmea.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3lneWljZ3VkYXNmd3dobWVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDk2NDkzMCwiZXhwIjoyMDkwNTQwOTMwfQ.vOSFZSMjn8z1DzKsPHFgJwfAjv1XEq7cwuSR7CJzumk';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function check() {
    console.log('--- Categorias no Banco ---');
    const { data: cats } = await supabase.from('categories').select('*');
    console.log(cats);

    console.log('\n--- Subcategorias no Banco ---');
    const { data: subs } = await supabase.from('subcategories').select('*');
    console.log(subs);
}

check();
