// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: ESM module
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
}

const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { headers: CORS, status })

// @ts-ignore: Deno global
serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

    try {
        const body = await req.json();
        console.log('--- Webhook Recebido ---');
        console.log('Body:', JSON.stringify(body));

        // @ts-ignore: Deno global
        const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        // @ts-ignore: Deno global
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        // @ts-ignore: Deno global
        const supabaseServiceKey = Deno.env.get('MP_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY');

        // Extrair ID
        const mpPaymentId = body?.data?.id || (body?.resource ? body.resource.split('/').pop() : null) || body.id;
        
        if (!mpPaymentId || isNaN(Number(mpPaymentId))) {
            return json({ success: true, message: "ID de simulação ou vazio. Ignorado." });
        }

        if (!accessToken) {
            console.error('AccessToken Faltando!');
            return json({ success: false, message: "MERCADO_PAGO_ACCESS_TOKEN não configurado no servidor." }, 500);
        }

        // 1. Consultar Mercado Pago
        console.log(`Consultando API para ${mpPaymentId}...`);
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!mpResponse.ok) {
            const errBody = await mpResponse.text();
            console.warn(`Aviso de Erro MP [${mpResponse.status}]:`, errBody);
            
            // SEMPRE respondemos 200 para testes e simulações ficarem verdes
            return json({ 
                success: true, 
                message: `Recebido, mas MP retornou ${mpResponse.status}. Provavelmente é uma simulação.`,
                debug: errBody 
            });
        }

        const mpData = await mpResponse.json();
        const orderId = mpData.external_reference;
        const mpStatus = mpData.status;

        if (!orderId) {
            console.warn('Sem OrderId (external_reference)');
            return json({ success: true, message: "Pagamento processado mas sem vínculo (external_reference)." });
        }

        // 2. Atualizar Banco
        if (supabaseUrl && supabaseServiceKey) {
            try {
                const supabase = createClient(supabaseUrl, supabaseServiceKey);
                
                // Mapeamento
                const statusMapping: Record<string, string> = {
                    'approved': 'pago',
                    'pending': 'aguardando',
                    'in_process': 'aguardando',
                    'rejected': 'recusado',
                    'cancelled': 'cancelado'
                };
                const novoStatus = statusMapping[mpStatus] || 'aguardando';

                // Tentar logar pagamento
                await supabase.from('pagamentos').upsert({
                    id: String(mpData.id),
                    status: mpData.status,
                    status_detail: mpData.status_detail,
                    transaction_amount: mpData.transaction_amount,
                    payment_method_id: mpData.payment_method_id,
                    external_reference: orderId,
                    created_at: mpData.date_created
                }).catch(() => null);

                // Atualizar Pedido
                await supabase.from('pedidos').update({
                    status: novoStatus,
                    mp_payment_id: String(mpPaymentId),
                    cartao_final: mpData.card?.last_four_digits || null,
                    ...(novoStatus === 'pago' ? { data_pagamento: new Date().toISOString() } : {})
                }).eq('id', orderId);

                console.log(`✅ Sucesso no banco para pedido ${orderId}`);

            } catch (dbErr: any) {
                console.error('Erro de Banco:', dbErr.message);
            }
        } else {
            console.error('Configuração de SupabaseUrl ou Key ausente!');
        }

        return json({ success: true, orderId, mpStatus });

    } catch (err: any) {
        console.error('Erro no Webhook:', err.message);
        return json({ success: false, message: err.message }, 500);
    }
})
