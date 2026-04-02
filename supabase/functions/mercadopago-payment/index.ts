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
        const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')
        // @ts-ignore: Deno global
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        // @ts-ignore: Deno global
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!accessToken) return json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado no servidor' })
        if (!supabaseUrl || !supabaseServiceKey) return json({ error: 'Supabase URL ou Key não configurados' })

        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        const body = await req.json()

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
            payment_type,
            transaction_amount,
            payer_email,
            payer_first_name,
            payer_last_name,
            external_reference,
            description,
            token,
            installments,
            payment_method_id,
        } = body

        if (!payment_type || !transaction_amount || !payer_email) {
            return json({ error: 'Campos obrigatórios ausentes: payment_type, transaction_amount, payer_email' })
        }

        const amount = Math.round(Number(transaction_amount) * 100) / 100
        if (isNaN(amount) || amount <= 0) {
            return json({ error: `Valor inválido: ${transaction_amount}` })
        }

        const payer: Record<string, string> = { email: payer_email };
        if (payer_first_name || payer_last_name) {
            payer.first_name = payer_first_name || 'Cliente';
            payer.last_name = payer_last_name || 'Automatiza';
        }

        const payload: Record<string, unknown> = {
            transaction_amount: amount,
            description: description || 'Pedido Automatiza',
            external_reference: external_reference || crypto.randomUUID(),
            payer,
        }

        if (payment_type === 'pix') {
            payload.payment_method_id = 'pix'
        } else if (payment_type === 'credit_card') {
            if (!token) return json({ error: 'Token do cartão é obrigatório' })
            payload.token = token
            payload.installments = Number(installments) || 1
            payload.payment_method_id = payment_method_id
        } else {
            return json({ error: `Tipo inválido: "${payment_type}". Use "pix" ou "credit_card"` })
        }

        const idempotencyKey = `${external_reference || ''}-${Date.now()}`

        console.log('→ MP Payload:', JSON.stringify(payload))

        const r = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
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

            await supabase
                .from('pedidos')
                .update({
                    mp_payment_id: String(data.id),
                    status: novoStatus,
                    metodo_pagamento: payment_type,
                    cartao_final: data.card?.last_four_digits || null,
                    ...(novoStatus === 'pago' ? { data_pagamento: new Date().toISOString() } : {})
                })
                .eq('id', external_reference)

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
                    external_reference: external_reference,
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

