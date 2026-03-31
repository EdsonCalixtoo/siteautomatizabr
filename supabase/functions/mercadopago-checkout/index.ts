// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno module
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore: Deno global
serve(async (req: Request) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: CORS_HEADERS })
    }

    try {
        const { items, customer, orderId } = await req.json()

        // 1. Prepare items for Mercado Pago
        const mpItems = items.map((item: any) => ({
            id: item.id,
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
            currency_id: 'BRL',
            picture_url: item.image,
            category_id: item.category || 'others'
        }))

        // 2. Create preference object
        const preference = {
            items: mpItems,
            payer: {
                name: customer.name,
                email: customer.email,
                phone: {
                    number: customer.phone.replace(/\D/g, '')
                }
            },
            external_reference: orderId,
            back_urls: {
                success: `${req.headers.get('origin')}/minha-conta?status=success`,
                failure: `${req.headers.get('origin')}/checkout?status=failure`,
                pending: `${req.headers.get('origin')}/minha-conta?status=pending`,
            },
            auto_return: 'approved',
            payment_methods: {
                excluded_payment_types: [
                    { id: 'ticket' } // Exclude bank slip (boleto) if desired, or remove to keep it
                ],
                installments: 12
            }
        }

        // 3. Call Mercado Pago API
        // @ts-ignore: Deno global
        const accessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')

        if (!accessToken) {
            throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not set in Supabase')
        }

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        })

        const data = await response.json()

        if (!response.ok) {
            console.error('MP Error:', data)
            throw new Error(data.message || 'Erro ao criar preferência no Mercado Pago')
        }

        return new Response(
            JSON.stringify({ id: data.id, init_point: data.init_point }),
            {
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
