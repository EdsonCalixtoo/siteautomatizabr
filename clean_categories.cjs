const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://rjumvufmdrnrebehieqn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdW12dWZtZHJucmViZWhpZXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNTIyMzIsImV4cCI6MjA5NjcyODIzMn0.8VwqL0C4omD1lbOAxTeSLKK7r8SQskjIjywblBScwV0';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) {
        console.error("Erro ao buscar categorias:", error);
        return;
    }
    console.log("Categorias no banco:");
    console.table(categories);
}

run();
