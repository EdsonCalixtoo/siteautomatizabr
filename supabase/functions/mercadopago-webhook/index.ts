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

        // Mercado Pago sends: { type: "payment", data: { id: "..." } }
        if (body.type !== 'payment') {
            return json({ message: `Evento "${body.type}" ignorado` })
        }

        const mpPaymentId = body?.data?.id
        if (!mpPaymentId) return json({ error: 'ID de pagamento inválido' }, 400)

        // Buscar detalhes do pagamento na API do Mercado Pago
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        const mpData = await mpResponse.json()

        console.log('MP Payment data:', JSON.stringify({
            id: mpData.id,
            status: mpData.status,
            external_reference: mpData.external_reference,
        }))

        const orderId = mpData.external_reference
        const status = mpData.status // "approved" | "pending" | "rejected"

        if (!orderId) {
            console.warn('Pagamento sem external_reference, ignorando.')
            return json({ message: 'Sem referência de pedido' })
        }

        // Buscar o pedido no Supabase com mais detalhes para o e-mail
        const { data: order, error: fetchError } = await supabase
            .from('pedidos')
            .select('id, status, cliente_nome, cliente_email, total, itens, subtotal, frete, desconto, tipo_entrega')
            .eq('id', orderId)
            .single()

        if (fetchError || !order) {
            console.error('Pedido não encontrado:', orderId)
            return json({ error: 'Pedido não encontrado' }, 404)
        }

        // Evitar processar pedidos já pagos (idempotência)
        if (order.status === 'pago') {
            console.log(`Pedido ${orderId} já está pago. Ignorando.`)
            return json({ message: 'Pedido já processado' })
        }

        // Atualizar status no banco conforme resposta do MP
        let novoStatus = order.status
        if (status === 'approved') novoStatus = 'pago'
        else if (status === 'rejected' || status === 'cancelled') novoStatus = 'cancelado'

        if (novoStatus !== order.status) {
            const { error: updateError } = await supabase
                .from('pedidos')
                .update({
                    status: novoStatus,
                    mp_payment_id: String(mpPaymentId),
                    cartao_final: mpData.card?.last_four_digits || null,
                    ...(novoStatus === 'pago' ? { data_pagamento: new Date().toISOString() } : {}),
                })
                .eq('id', orderId)

            if (updateError) {
                console.error('Erro ao atualizar pedido:', updateError)
                return json({ error: 'Erro ao atualizar pedido' }, 500)
            }

            console.log(`✅ Pedido ${orderId} atualizado para "${novoStatus}"`)

            // SE O PAGAMENTO FOI APROVADO, MANDAR E-MAIL
            if (novoStatus === 'pago' && order.cliente_email) {
                try {
                    console.log(`Disparando e-mail de confirmação via funtion para ${order.cliente_email}...`)
                    
                    // Chamar a função centralizada de e-mail (self-call via fetch)
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
                    
                } catch (emailErr) {
                    console.error('Erro ao disparar função de e-mail:', emailErr)
                }
            }

            // NOTIFICAÇÃO TELEGRAM PARA O ADMIN (OPCIONAL)
            if (novoStatus === 'pago') {
                try {
                    // @ts-ignore: Deno global
                    const tgToken = Deno.env.get('TELEGRAM_BOT_TOKEN')
                    // @ts-ignore: Deno global
                    const tgChatId = Deno.env.get('TELEGRAM_CHAT_ID')
                    if (tgToken && tgChatId) {
                        const message = `💰 *NOVA VENDA APROVADA!*\n\n` +
                                      `📦 *Pedido:* #${orderId.slice(0, 8)}\n` +
                                      `👤 *Cliente:* ${order.cliente_nome}\n` +
                                      `💵 *Valor:* R$ ${order.total.toFixed(2)}\n` +
                                      `🚚 *Entrega:* ${order.tipo_entrega === 'retirada' ? 'Retirada no Local' : 'Entrega via Transportadora'}`
                        
                        await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: tgChatId,
                                text: message,
                                parse_mode: 'Markdown'
                            })
                        })
                        console.log('Notificação Telegram enviada.')
                    }
                } catch (tgErr) {
                    console.error('Erro ao enviar notificação Telegram:', tgErr)
                }
            }
        }

        return json({ received: true, orderId, status: novoStatus })

    } catch (err: any) {
        console.error('Webhook error:', err)
        return json({ error: err.message }, 500)
    }
})
