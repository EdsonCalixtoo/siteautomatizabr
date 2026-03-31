// @ts-ignore: Deno module
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: ESM module
import { Resend } from "https://esm.sh/resend"

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
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        if (!resendApiKey) {
            console.error('RESEND_API_KEY is missing')
            return json({ error: 'Configuração inválida do servidor' }, 500)
        }

        const resend = new Resend(resendApiKey)
        const { order, type } = await req.json()

        if (!order || !type) {
            return json({ error: 'Dados insuficientes' }, 400)
        }

        console.log(`Enviando e-mail do tipo "${type}" para ${order.cliente_email}...`)

        let subject = ""
        let html = ""

        const itemsHtml = order.itens.map((item: any) => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}x</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">R$ ${item.price.toFixed(2)}</td>
            </tr>
        `).join('')

        const footer = `
            <div style="background-color: #f1f5f9; padding: 24px; text-align: center; color: #94a3b8; font-size: 12px;">
                <p style="margin: 0 0 8px;">Automatiza Kits e Acessórios</p>
                <p style="margin: 0;">R. Dr. Élton César, 910 - Campinas, SP</p>
            </div>
        `

        if (type === 'novo_pedido') {
          // E-mail para o ADMIN
          await resend.emails.send({
            from: 'Automatiza <onboarding@resend.dev>',
            to: ['juninho.caxto@gmail.com'],
            subject: `🔔 NOVO PEDIDO: #${order.id.slice(0, 8)}`,
            html: `
              <h1>Novo Pedido Recebido!</h1>
              <p><strong>Cliente:</strong> ${order.cliente_nome}</p>
              <p><strong>E-mail:</strong> ${order.cliente_email}</p>
              <p><strong>Valor:</strong> R$ ${order.total.toFixed(2)}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <h3>Itens:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
              <p><a href="https://automatiza1.vercel.app/admin/pedidos">Ver no Painel Admin</a></p>
            `,
          })

          // E-mail para o CLIENTE (Aguardando Pagamento)
          subject = `Aguardando Pagamento: Pedido #${order.id.slice(0, 8)}`
          html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background: #0891b2; padding: 32px; text-align: center; color: white;">
                    <h1 style="margin: 0;">Pedido Recebido! 🎉</h1>
                </div>
                <div style="padding: 32px; background: white;">
                    <p>Olá, ${order.cliente_nome}!</p>
                    <p>Recebemos seu pedido <strong>#${order.id.slice(0, 8)}</strong> com sucesso.</p>
                    <p>Estamos aguardando a confirmação do pagamento para iniciar o processamento.</p>
                    
                    <div style="margin: 32px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
                      <h3>Resumo:</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                        ${itemsHtml}
                      </table>
                      <p style="text-align: right; font-weight: bold; margin-top: 10px;">Total: R$ ${order.total.toFixed(2)}</p>
                    </div>

                    <div style="text-align: center;">
                        <a href="https://automatiza1.vercel.app/finalizar-pagamento?orderId=${order.id}" style="background: #0891b2; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Finalizar Pagamento</a>
                    </div>
                </div>
                ${footer}
            </div>
          `
        } else if (type === 'pagamento_aprovado') {
          subject = `Pagamento Aprovado! Pedido #${order.id.slice(0, 8)}`
          html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background: #22c55e; padding: 32px; text-align: center; color: white;">
                    <h1 style="margin: 0;">Tudo certo! 🚀</h1>
                </div>
                <div style="padding: 32px; background: white;">
                    <p>Olá, ${order.cliente_nome}!</p>
                    <p>Seu pagamento foi aprovado e seu pedido <strong>#${order.id.slice(0, 8)}</strong> já entrou para processamento.</p>
                    
                    <div style="margin: 32px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
                      <table style="width: 100%; border-collapse: collapse;">
                        ${itemsHtml}
                      </table>
                      <p style="text-align: right; font-weight: bold; margin-top: 10px;">Total Pago: R$ ${order.total.toFixed(2)}</p>
                    </div>

                    <div style="text-align: center;">
                        <a href="https://automatiza1.vercel.app/rastrear-pedido?id=${order.id}" style="background: #22c55e; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Acompanhar Pedido</a>
                    </div>
                </div>
                ${footer}
            </div>
          `
        }

        if (html) {
          await resend.emails.send({
            from: 'Automatiza <onboarding@resend.dev>',
            to: [order.cliente_email],
            subject: subject,
            html: html,
          })
        }

        return json({ success: true })

    } catch (err: any) {
        console.error('Email error:', err)
        return json({ error: err.message }, 500)
    }
})
