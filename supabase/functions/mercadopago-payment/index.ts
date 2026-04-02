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
        // @ts-ignore: Deno global
        const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        // @ts-ignore: Deno global
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        // @ts-ignore: Deno global
        const serviceKey = Deno.env.get('MP_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

        console.log('--- Nova Requisição de Pagamento ---');
        console.log(`Debug - URL capturada: ${supabaseUrl ? 'OK' : 'AUSENTE'}`);
        console.log(`Debug - Chave capturada: ${serviceKey ? 'OK' : 'AUSENTE'}`);
        
        if (!supabaseUrl || !serviceKey) {
            return json({ 
                error: 'Configuração de ambiente incompleta no Supabase.', 
                details: `SUPABASE_URL: ${supabaseUrl ? 'OK' : 'MISSING'}, SERVICE_KEY: ${serviceKey ? 'OK' : 'MISSING'}. Certifique-se de que os Secrets estão configurados.`
            }, 500);
        }

        if (!accessToken) {
            return json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado nos Secrets.' }, 500);
        }

        const supabaseMaster = createClient(supabaseUrl, serviceKey);
        // Usamos a anon key como fallback para leitura se a service_role estiver falhando
        const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
        const supabasePublic = createClient(supabaseUrl, anonKey);

        const body = await req.json();

        // ─── VALIDATE ORDER EXISTENCE ────────────────────────────
        const { orderId } = body;
        const targetId = orderId || body.external_reference;

        // Tentamos ler com o cliente master primeiro, se falhar usamos o public
        let { data: orderExists, error: checkError } = await supabaseMaster
            .from('pedidos')
            .select('id')
            .eq('id', targetId)
            .single();

        if (checkError) {
            console.warn('Master key falhou no SELECT, tentando Public Key...');
            const { data: publicData, error: publicError } = await supabasePublic
                .from('pedidos')
                .select('id')
                .eq('id', targetId)
                .single();
            
            if (!publicError) {
                orderExists = publicData;
                checkError = null;
            }
        }

        if (checkError || !orderExists) {
            const { data: lastOrders } = await supabaseMaster.from('pedidos').select('id').order('data_criacao', { ascending: false }).limit(3);
            return json({ 
                error: checkError?.message || 'Pedido não encontrado.', 
                receivedId: targetId,
                keyMatch: serviceKey?.substring(0, 10),
                db_error: checkError 
            }, 404);
        }

        const supabase = supabaseMaster;

        // ─── CHECK PAYMENT STATUS (PREVIOUS ATTEMPTS) ─────────────
        const { data: existingPayment } = await supabase
            .from('pagamentos')
            .select('status')
            .eq('pedido_id', orderId)
            .eq('status', 'approved')
            .single();

        if (existingPayment) {
            return json({ 
                error: 'Este pedido já possui um pagamento aprovado.',
                status: 'pago'
            }, 400);
        }

        // ─── CHECK PAYMENT STATUS ────────────────────────────────
        if (body.check_payment_id) {
            const r = await fetch(`https://api.mercadopago.com/v1/payments/${body.check_payment_id}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            })
            const data = await r.json()
            return json({ status: data.status, status_detail: data.status_detail })
        }

        // ─── CREATE PAYMENT ──────────────────────────────────────
        const {
            type,
            amount,
            payerEmail,
            payer_first_name,
            payer_last_name,
            orderId: bodyOrderId, // Usar o ID que já validamos antes
            description,
            cardToken,
            installments,
            issuerId,
            paymentMethodId,
        } = body;

        // Fallback para nomes antigos se necessário
        const finalType = type || body.payment_type;
        const finalAmount = amount || body.transaction_amount;
        const finalEmail = payerEmail || body.payer_email;
        const finalOrderId = bodyOrderId || body.orderId || body.external_reference;

        if (!finalType || !finalAmount || !finalEmail) {
            return json({ 
                error: 'Campos obrigatórios ausentes: type, amount, payerEmail',
                received: { type: finalType, amount: finalAmount, email: finalEmail }
            }, 400);
        }

        const numericAmount = Math.round(Number(finalAmount) * 100) / 100;
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return json({ error: `Valor inválido: ${finalAmount}` }, 400);
        }

        const payer: Record<string, string> = { email: finalEmail };
        if (payer_first_name || payer_last_name) {
            payer.first_name = payer_first_name || 'Cliente';
            payer.last_name = payer_last_name || 'Automatiza';
        }

        const payload: Record<string, unknown> = {
            transaction_amount: numericAmount,
            description: description || 'Pedido Automatiza',
            external_reference: finalOrderId || crypto.randomUUID(),
            payer,
        }

        if (finalType === 'pix') {
            payload.payment_method_id = 'pix'
        } else if (finalType === 'credit_card') {
            if (!cardToken) return json({ error: 'Token do cartão é obrigatório' })
            payload.token = cardToken
            payload.installments = Number(installments) || 1
            payload.payment_method_id = paymentMethodId
            payload.issuer_id = issuerId
        } else {
            return json({ error: `Tipo inválido: "${finalType}". Use "pix" ou "credit_card"` })
        }

        const idempotencyKey = `${finalOrderId || ''}-${Date.now()}`

        console.log('→ MP Payload:', JSON.stringify(payload))

        // Enviando o Access Token na URL como query parameter (mais robusto)
        const url = `https://api.mercadopago.com/v1/payments?access_token=${accessToken}`

        const r = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Idempotency-Key': idempotencyKey,
            },
            body: JSON.stringify(payload),
        })

        const data = await r.json()
        console.log('← MP Response:', r.status, JSON.stringify(data).slice(0, 500))

        if (!r.ok) {
            const mpError = data?.cause?.[0]?.description || data?.message || data?.error || `Erro ${r.status} do Mercado Pago`
            return json({ error: mpError, mp_status: r.status })
        }

        // SALVAR NO SUPABASE (PEDIDOS E PAGAMENTOS)
        try {
            // 1. Atualizar a tabela de pedidos com o ID do pagamento e status inicial
            const orderStatusMap: Record<string, string> = {
                'approved': 'pago',
                'pending': 'aguardando_pagamento',
                'in_process': 'aguardando_pagamento',
                'rejected': 'cancelado',
                'cancelled': 'cancelado',
            }

            const novoStatus = orderStatusMap[data.status] || 'aguardando_pagamento'

            const { data: updateRes, error: paymentError } = await supabase
                .from('pedidos')
                .update({
                    mp_payment_id: String(data.id),
                    status: novoStatus,
                    metodo_pagamento: finalType,
                    cartao_final: data.card?.last_four_digits || null,
                    pix_code: data.point_of_interaction?.transaction_data?.qr_code || null,
                    pix_qrcode: data.point_of_interaction?.transaction_data?.qr_code_base64 || null,
                    ...(novoStatus === 'pago' ? { data_pagamento: new Date().toISOString() } : {})
                })
                .eq('id', finalOrderId);

        if (paymentError) {
            console.error('Erro de Banco Detalhado:', paymentError);
            return json({ 
                error: paymentError.message, 
                code: paymentError.code, 
                hint: paymentError.hint,
                details: paymentError.details 
            }, 500);
        }

            // 2. Opcional: Salvar na tabela de pagamentos para histórico completo se existir
            // Apenas tentamos, se falhar (tabela não existir) não quebra o fluxo
            const { error: pagError } = await supabase
                .from('pagamentos')
                .upsert({
                    id: String(data.id),
                    status: data.status,
                    status_detail: data.status_detail,
                    transaction_amount: data.transaction_amount,
                    payment_method_id: data.payment_method_id,
                    external_reference: finalOrderId,
                    created_at: data.date_created
                })
            
            if (pagError) console.warn('Aviso: Tabela pagamentos não encontrada ou erro ao inserir:', pagError.message)

        } catch (dbErr) {
            console.error('Erro ao salvar no banco:', dbErr)
        }

        return json(data)

    } catch (err: any) {
        console.error('Erro interno:', err)
        return json({ error: err.message || 'Erro interno no servidor' })
    }
})

