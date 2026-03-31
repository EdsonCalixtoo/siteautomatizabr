// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
        if (!accessToken) return json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado no servidor' })

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

        const payload: Record<string, unknown> = {
            transaction_amount: amount,
            description: description || 'Pedido Automatiza',
            external_reference: external_reference || crypto.randomUUID(),
            payer: {
                email: payer_email,
                first_name: payer_first_name || 'Cliente',
                last_name: payer_last_name || 'Automatiza',
            },
        }

        if (payment_type === 'pix') {
            payload.payment_method_id = 'pix'
        } else if (payment_type === 'credit_card') {
            if (!token) return json({ error: 'Token do cartão é obrigatório' })
            payload.token = token
            payload.installments = Number(installments) || 1
            payload.payment_method_id = payment_method_id
            payload.transaction_details = {}
        } else {
            return json({ error: `Tipo inválido: "${payment_type}". Use "pix" ou "credit_card"` })
        }

        // Use unique idempotency key per attempt (not external_reference)
        // to avoid 422 on retry
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
        console.log('← MP Status:', r.status, 'Response:', JSON.stringify(data).slice(0, 500))

        if (!r.ok) {
            // Extract most useful error message from Mercado Pago
            const mpError =
                data?.cause?.[0]?.description ||
                data?.message ||
                data?.error ||
                `Erro ${r.status} do Mercado Pago`
            console.error('MP Error:', mpError, JSON.stringify(data))
            // Return 200 with error field so supabase.functions.invoke gets the body
            return json({ error: mpError, mp_status: r.status, mp_details: data })
        }

        return json(data)

    } catch (err: any) {
        console.error('Erro interno:', err)
        return json({ error: err.message || 'Erro interno no servidor' })
    }
})
