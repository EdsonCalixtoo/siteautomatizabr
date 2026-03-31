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
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;">${item.name}</td>
                <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b;">${item.quantity}x</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #1e293b;">R$ ${item.price.toFixed(2)}</td>
            </tr>
        `).join('')

        const footer = `
            <div style="background-color: #f8fafc; padding: 32px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0 0 8px; font-weight: bold; color: #64748b;">Automatiza Kits e Acessórios</p>
                <p style="margin: 0 0 16px;">R. Dr. Élton César, 910 - Campinas, SP</p>
                <div style="margin-bottom: 16px;">
                  <a href="https://automatiza1.vercel.app" style="color: #0891b2; text-decoration: none; margin: 0 10px;">Site</a>
                  <a href="https://wa.me/5519989429872" style="color: #0891b2; text-decoration: none; margin: 0 10px;">WhatsApp</a>
                </div>
                <p style="margin: 0; opacity: 0.6;">© 2026 Automatiza. Todos os direitos reservados.</p>
            </div>
        `

        const logoUrl = "https://grupoautomatiza.com.br/logo.jpg";

        if (type === 'novo_pedido') {
          // E-mail para o ADMIN
          await resend.emails.send({
            from: 'Automatiza <vendas@grupoautomatiza.com.br>',
            to: ['juninho.caxto@gmail.com'],
            subject: `🔔 NOVO PEDIDO: #${order.id.slice(0, 8)}`,
            html: `
              <div style="font-family: sans-serif; background: #f1f5f9; padding: 40px 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                  <div style="padding: 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                    <img src="${logoUrl}" alt="Logo" style="height: 50px;" />
                  </div>
                  <div style="padding: 32px;">
                    <h2 style="color: #1e293b; margin-top: 0;">Novo Pedido Recebido! 🛍️</h2>
                    <p style="color: #64748b;">Um novo pedido acaba de ser realizado no site.</p>
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0;">
                      <p style="margin: 0 0 8px;"><strong>Cliente:</strong> ${order.cliente_nome}</p>
                      <p style="margin: 0 0 8px;"><strong>E-mail:</strong> ${order.cliente_email}</p>
                      <p style="margin: 0 0 8px;"><strong>Valor:</strong> R$ ${order.total.toFixed(2)}</p>
                      <p style="margin: 0;"><strong>Status:</strong> ${order.status}</p>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                      ${itemsHtml}
                    </table>
                    <a href="https://automatiza1.vercel.app/admin/pedidos" style="display: block; text-align: center; background: #0891b2; color: white; padding: 16px; border-radius: 12px; text-decoration: none; font-weight: bold;">Ver no Painel Admin</a>
                  </div>
                </div>
              </div>
            `,
          })

          // E-mail para o CLIENTE (Aguardando Pagamento)
          subject = `Aguardando Pagamento: Pedido #${order.id.slice(0, 8)}`
          html = `
            <div style="font-family: sans-serif; background: #f1f5f9; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                  <div style="padding: 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                      <img src="${logoUrl}" alt="Logo" style="height: 60px;" />
                  </div>
                  <div style="padding: 32px;">
                      <h1 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; text-align: center;">Pedido Recebido! 🎉</h1>
                      <p style="color: #64748b; line-height: 1.6; text-align: center;">Olá, ${order.cliente_nome.split(' ')[0]}! Recebemos seu pedido <strong>#${order.id.slice(0, 8)}</strong> com sucesso.</p>
                      
                      <div style="margin: 32px 0; padding: 24px; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
                        <h3 style="margin-top: 0; color: #0891b2; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Resumo da Compra</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                          ${itemsHtml}
                        </table>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #e2e8f0; display: flex; justify-content: space-between;">
                          <span style="font-weight: bold; color: #1e293b;">Total:</span>
                          <span style="font-weight: 800; color: #0891b2; font-size: 20px;">R$ ${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div style="text-align: center;">
                          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Estamos aguardando a confirmação do pagamento para iniciar o seu envio.</p>
                          <a href="https://automatiza1.vercel.app/finalizar-pagamento?orderId=${order.id}" style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(8, 145, 178, 0.2);">Finalizar Pagamento Agora</a>
                      </div>
                  </div>
                  ${footer}
              </div>
            </div>
          `
        } else if (type === 'pagamento_aprovado') {
          subject = `Pagamento Aprovado! Pedido #${order.id.slice(0, 8)}`
          html = `
            <div style="font-family: sans-serif; background: #f1f5f9; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                  <div style="padding: 32px; text-align: center; border-bottom: 1px solid #f1f5f9;">
                      <img src="${logoUrl}" alt="Logo" style="height: 60px;" />
                  </div>
                  <div style="padding: 32px;">
                      <h1 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; text-align: center;">Tudo certo! 🚀</h1>
                      <p style="color: #64748b; line-height: 1.6; text-align: center;">Olá, ${order.cliente_nome.split(' ')[0]}! Seu pagamento foi <strong>aprovado</strong> e seu pedido já está sendo preparado.</p>
                      
                      <div style="margin: 32px 0; padding: 24px; background: #f0fdf4; border-radius: 16px; border: 1px solid #bbf7d0;">
                        <table style="width: 100%; border-collapse: collapse;">
                          ${itemsHtml}
                        </table>
                        <div style="margin-top: 16px; padding-top: 16px; border-top: 2px solid #bbf7d0; display: flex; justify-content: space-between;">
                          <span style="font-weight: bold; color: #1e293b;">Total Pago:</span>
                          <span style="font-weight: 800; color: #15803d; font-size: 20px;">R$ ${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div style="text-align: center;">
                          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Em breve enviaremos o código de rastreio para você acompanhar a entrega.</p>
                          <a href="https://automatiza1.vercel.app/rastrear-pedido?id=${order.id}" style="background: #15803d; color: white; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Acompanhar Meu Pedido</a>
                      </div>
                  </div>
                  ${footer}
              </div>
            </div>
          `
        }

        if (html) {
          await resend.emails.send({
            from: 'Automatiza <vendas@grupoautomatiza.com.br>',
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
