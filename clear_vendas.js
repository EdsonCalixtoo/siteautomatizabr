const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clear() {
    console.log("Iniciando limpeza da nuvem...");
    const { data, error } = await supabase
        .from('pedidos')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
        console.error("Erro ao deletar pedidos:", error);
    } else {
        console.log("Pedidos deletados com sucesso no banco de dados!");
    }
    
    // Tenta também a tabela 'orders' por via das dúvidas
    const { error: error2 } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error2) {
        console.log("Tabela 'orders' não encontrada ou erro (ignorar se não existir).");
    } else {
        console.log("Tabela 'orders' limpa.");
    }
}

clear();
