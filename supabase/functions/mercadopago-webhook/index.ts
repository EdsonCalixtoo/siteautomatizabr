// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: ESM module
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature, x-request-id',
    'Content-Type': 'application/json',
}

const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), { headers: CORS, status })

// @ts-ignore: Deno global
serve(async (req: Request) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

    try {
        // @ts-ignore: Deno global
        const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
        // @ts-ignore: Deno global
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        // @ts-ignore: Deno global
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!accessToken || !supabaseUrl || !supabaseServiceKey) {
            console.error('Missing environment variables')
            return json({ error: 'Configuração inválida do servidor' }, 500)
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const body = await req.json()
        console.log('Webhook received:', JSON.stringify(body))

        if (body.type !== 'payment') {
            return json({ message: `Evento "${body.type}" ignorado` })
        }

        const mpPaymentId = body?.data?.id
        if (!mpPaymentId) return json({ error: 'ID de pagamento inválido' }, 400)

        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const mpData = await mpResponse.json()

        console.log('MP Payment data:', JSON.stringify({
            id: mpData.id,
            status: mpData.status,
            status_detail: mpData.status_detail,
            payment_type_id: mpData.payment_type_id,
            external_reference: mpData.external_reference,
        }))

        const orderId = mpData.external_reference
        const status = mpData.status 

        if (!orderId) {
            return json({ message: 'Sem referência de pedido' })
        }

        const { data: order, error: fetchError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', orderId)
            .single()

        if (fetchError || !order) {
            console.error('Pedido não encontrado:', orderId)
            return json({ error: 'Pedido não encontrado' }, 404)
        }

        // Mapeamento de Status do Mercado Pago para o seu sistema
        let novoStatus = order.status
        if (status === 'approved') {
            novoStatus = 'pago'
        } else if (status === 'rejected' || status === 'cancelled' || status === 'expired') {
            novoStatus = 'cancelado' // Na Dashboard ele aparecerá como cancelado
        }

        // Definir o método de pagamento real usado
        const realPaymentMethod = mpData.payment_type_id === 'bank_transfer' ? 'pix' : 'cartao'

        if (novoStatus !== order.status || order.metodo_pagamento !== realPaymentMethod) {
            const { error: updateError } = await supabase
                .from('pedidos')
                .update({
                    status: novoStatus,
                    metodo_pagamento: realPaymentMethod,
                    mp_payment_id: String(mpPaymentId),
                    cartao_final: mpData.card?.last_four_digits || null,
                    ...(novoStatus === 'pago' ? { data_pagamento: new Date().toISOString() } : {}),
                })
                .eq('id', orderId)

            if (updateError) {
                console.error('Erro ao atualizar pedido:', updateError)
                return json({ error: 'Erro ao atualizar pedido' }, 500)
            }

            console.log(`✅ Pedido ${orderId} atualizado para "${novoStatus}" (${realPaymentMethod})`)

            // SE FOI PAGO, MANDA E-MAIL "PAGAMENTO APROVADO"
            if (novoStatus === 'pago') {
                const functionUrl = `${supabaseUrl}/functions/v1/send-order-email`
                await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseServiceKey}`,
                    },
                    body: JSON.stringify({
                        order: { ...order, status: novoStatus },
                        type: 'pagamento_aprovado'
                    })
                })
            }
        }

        return json({ received: true, orderId, status: novoStatus })

    } catch (err: any) {
        console.error('Webhook error:', err)
        return json({ error: err.message }, 500)
    }
})
