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

        // No Mercado Pago, o ID pode estar em data.id ou resource (dependendo da versão)
        const mpPaymentId = body?.data?.id || (body?.resource ? body.resource.split('/').pop() : null);
        
        if (!mpPaymentId || (body.type !== 'payment' && body.topic !== 'payment')) {
            return json({ message: `Evento "${body.type || body.topic}" ignorado ou sem ID` })
        }

        // Buscar dados completos do pagamento na API do Mercado Pago
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${mpPaymentId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        })
        
        if (!mpResponse.ok) {
            console.error('Erro ao buscar pagamento no MP:', await mpResponse.text())
            return json({ error: 'Erro ao consultar Mercado Pago' }, 500)
        }
        
        const mpData = await mpResponse.json()
        const orderId = mpData.external_reference
        const mpStatus = mpData.status 

        if (!orderId) {
            console.warn('Webhook sem external_reference (Order ID)')
            return json({ message: 'Sem referência de pedido' })
        }

        // 1. ATUALIZAR TABELA DE PAGAMENTOS (LOG/HISTÓRICO)
        const { error: pagError } = await supabase
            .from('pagamentos')
            .upsert({
                id: String(mpData.id),
                status: mpData.status,
                status_detail: mpData.status_detail,
                transaction_amount: mpData.transaction_amount,
                payment_method_id: mpData.payment_method_id,
                external_reference: orderId,
                created_at: mpData.date_created
            })
        
        if (pagError) console.warn('Aviso: Tabela pagamentos não atualizada:', pagError.message)

        // 2. ATUALIZAR TABELA DE PEDIDOS (STATUS PRINCIPAL)
        // Mapeamento solicitado pelo usuário:
        // approved → pago, pending → aguardando, rejected → recusado
        const statusMapping: Record<string, string> = {
            'approved': 'pago',
            'pending': 'aguardando',
            'in_process': 'aguardando',
            'rejected': 'recusado',
            'cancelled': 'cancelado',
            'refunded': 'cancelado',
            'charged_back': 'cancelado',
        }

        const novoStatus = statusMapping[mpStatus] || 'aguardando'
        const realPaymentMethod = mpData.payment_type_id === 'bank_transfer' ? 'pix' : 'cartao'

        const { data: order, error: fetchError } = await supabase
            .from('pedidos')
            .select('*')
            .eq('id', orderId)
            .single()

        if (fetchError || !order) {
            console.error('Pedido não encontrado:', orderId)
            return json({ error: 'Pedido não encontrado' }, 404)
        }

        // Só atualizamos se houver mudança ou para garantir IDs
        const updateData: any = {
            status: novoStatus,
            metodo_pagamento: realPaymentMethod,
            mp_payment_id: String(mpPaymentId),
            cartao_final: mpData.card?.last_four_digits || null,
        }

        if (novoStatus === 'pago' && !order.data_pagamento) {
            updateData.data_pagamento = new Date().toISOString()
        }

        const { error: updateError } = await supabase
            .from('pedidos')
            .update(updateData)
            .eq('id', orderId)

        if (updateError) {
            console.error('Erro ao atualizar pedido:', updateError)
            return json({ error: 'Erro ao atualizar pedido' }, 500)
        }

        console.log(`✅ Pedido ${orderId} atualizado para "${novoStatus}"`)

        // 3. DISPARAR E-MAIL SE O STATUS MUDOU PARA PAGO
        if (novoStatus === 'pago' && order.status !== 'pago') {
            try {
                const functionUrl = `${supabaseUrl}/functions/v1/send-order-email`
                await fetch(functionUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supabaseServiceKey}`,
                    },
                    body: JSON.stringify({
                        order: { ...order, ...updateData },
                        type: 'pagamento_aprovado'
                    })
                })
            } catch (emailErr) {
                console.error('Erro ao disparar e-mail:', emailErr)
            }
        }

        return json({ received: true, orderId, status: novoStatus })

    } catch (err: any) {
        console.error('Webhook error:', err)
        return json({ error: err.message }, 500)
    }
})

