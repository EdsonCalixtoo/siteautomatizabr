import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkOrder() {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .ilike('id', '7a207189%')
    .single();

  if (error) {
    console.error("Erro ao buscar pedido:", error);
    return;
  }

  console.log("Pedido encontrado:", order);

  if (order.mp_payment_id) {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${order.mp_payment_id}`, {
      headers: { 'Authorization': `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` }
    });
    const mpData = await res.json();
    console.log("Status no MP:", mpData.status, " - Expiracao:", mpData.date_of_expiration);
  } else {
    console.log("Nenhum mp_payment_id salvo no banco!");
  }
}

checkOrder();
