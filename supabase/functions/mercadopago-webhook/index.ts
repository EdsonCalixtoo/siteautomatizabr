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
                    // @ts-ignore: Deno global
                    const resendApiKey = Deno.env.get('RESEND_API_KEY')
                    if (resendApiKey) {
                        console.log(`Enviando e-mail de confirmação para ${order.cliente_email}...`)
                        
                        const itemsHtml = order.itens.map((item: any) => `
                            <tr>
                                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}x</td>
                                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
                            </tr>
                        `).join('')

                        const emailHtml = `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            <div style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 32px; text-align: center; color: white;">
                                <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em;">PEDIDO CONFIRMADO! 🎉</h1>
                                <p style="margin: 8px 0 0; opacity: 0.9; font-size: 16px;">Olá, ${order.cliente_nome.split(' ')[0]}!</p>
                            </div>
                            
                            <div style="padding: 32px; background-color: white;">
                                <div style="margin-bottom: 32px; text-align: center;">
                                    <p style="font-size: 18px; line-height: 1.6; margin: 0;">Ficamos muito felizes! Seu pagamento foi aprovado e seu pedido <strong>#${orderId.slice(0, 8)}</strong> já entrou para processamento.</p>
                                </div>
                                
                                <h3 style="color: #0891b2; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Resumo do Pedido</h3>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                    <thead>
                                        <tr style="font-size: 12px; color: #64748b; text-transform: uppercase;">
                                            <th style="text-align: left; padding: 10px;">Produto</th>
                                            <th style="padding: 10px;">Qtd</th>
                                            <th style="text-align: right; padding: 10px;">Preço</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${itemsHtml}
                                    </tbody>
                                </table>
                                
                                <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <span style="color: #64748b;">Subtotal</span>
                                        <span style="font-weight: 600;">R$ ${order.subtotal?.toFixed(2) || (order.total - (order.frete || 0)).toFixed(2)}</span>
                                    </div>
                                    ${order.frete ? `
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                        <span style="color: #64748b;">Frete</span>
                                        <span style="font-weight: 600;">R$ ${order.frete.toFixed(2)}</span>
                                    </div>` : ''}
                                    <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                                        <span style="font-size: 18px; font-weight: 800; color: #0891b2;">TOTAL</span>
                                        <span style="font-size: 18px; font-weight: 800; color: #0891b2;">R$ ${order.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div style="margin-top: 32px; padding-top: 32px; border-top: 2px solid #f1f5f9; text-align: center;">
                                    <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 12px;">Próximos Passos</h3>
                                    <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Agora nossa equipe vai preparar seus produtos com todo cuidado. Você receberá novas atualizações em breve!</p>
                                    <a href="https://automatiza1.vercel.app/rastrear-pedido?id=${orderId}&email=${order.cliente_email}" style="background: #0891b2; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Acompanhar Pedido</a>
                                </div>
                            </div>
                            
                            <div style="background-color: #f1f5f9; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
                                <p style="margin: 0 0 8px;">Automatiza Kits e Acessórios</p>
                                <p style="margin: 0;">R. Dr. Élton César, 910 - Campinas, SP</p>
                            </div>
                        </div>
                        `

                        const response = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${resendApiKey}`,
                            },
                            body: JSON.stringify({
                                from: 'onboarding@resend.dev',
                                to: [order.cliente_email],
                                subject: `Pagamento Aprovado! Pedido #${orderId.slice(0, 8)}`,
                                html: emailHtml,
                            }),
                        })
                        
                        const resendData = await response.json()
                        console.log('Resend Response:', JSON.stringify(resendData))
                    } else {
                        console.warn('RESEND_API_KEY não configurada. E-mail não enviado.')
                    }
                } catch (emailErr) {
                    console.error('Erro ao enviar e-mail:', emailErr)
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
