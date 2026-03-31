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
        const resend = new Resend(resendApiKey)
        const { order, type } = await req.json()

        const siteUrl = "https://grupoautomatiza.com.br";
        const logoUrl = `${siteUrl}/logo.jpg`;
        const primaryColor = "#0891b2"; 
        const primeironome = order.cliente_nome ? order.cliente_nome.split(' ')[0] : 'Cliente';

        const itemsHtml = (order.itens || []).map((item: any) => `
            <tr>
                <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9;">
                    <div style="font-weight: 600; color: #1e293b; font-size: 15px;">${item.name}</div>
                    <div style="font-size: 13px; color: #64748b;">Quantidade: ${item.quantity}</div>
                </td>
                <td style="padding: 15px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 700; color: #1e293b; font-size: 15px;">
                    R$ ${(item.price || 0).toFixed(2)}
                </td>
            </tr>
        `).join('')

        const footerHtml = `
            <div style="padding: 40px 20px; text-align: center; background: #ffffff;">
                <div style="margin-bottom: 20px;">
                    <a href="https://wa.me/5519989429872" style="display: inline-block; padding: 12px 24px; background: #22c55e; color: white; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 14px;">Chamar no WhatsApp</a>
                </div>
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">© 2026 Automatiza Kits e Acessórios</p>
                <p style="margin: 5px 0 0; color: #cbd5e1; font-size: 11px;">R. Dr. Élton César, 910 - Campinas, SP</p>
            </div>
        `;

        let subject = "";
        let contentHtml = "";

        switch (type) {
            case 'novo_pedido':
                subject = `Seu pedido #${order.id.slice(0, 8)} está sendo processado!`;
                contentHtml = `
                    <div style="text-align: center; padding-bottom: 30px;">
                        <h1 style="margin: 0; font-size: 28px; color: #1e293b; letter-spacing: -0.02em;">Pedido Recebido</h1>
                        <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">Olá, ${primeironome}. Recebemos sua solicitação!</p>
                    </div>
                    
                    <div style="background: #f8fafc; border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <span style="background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">Aguardando Pagamento</span>
                        </div>
                        <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
                        <div style="margin-top: 25px; padding-top: 25px; border-top: 2px solid #ffffff; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: 600; color: #64748b;">Total do Pedido</span>
                            <span style="font-weight: 800; color: #1e293b; font-size: 22px;">R$ ${order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <a href="${siteUrl}/finalizar-pagamento?orderId=${order.id}" style="display: inline-block; background: #0891b2; color: white; padding: 20px 45px; border-radius: 15px; text-decoration: none; font-weight: 700; font-size: 16px; box-shadow: 0 10px 20px rgba(8, 145, 178, 0.2);">Pagar Agora</a>
                        <p style="margin-top: 20px; font-size: 13px; color: #94a3b8;">Clique acima para escolher a forma de pagamento.</p>
                    </div>
                `;
                break;

            case 'pagamento_aprovado':
                subject = `Pagamento Confirmado! Pedido #${order.id.slice(0, 8)}`;
                contentHtml = `
                    <div style="text-align: center; padding-bottom: 30px;">
                        <div style="margin-bottom: 20px; display: inline-block; background: #f0fdf4; padding: 15px; border-radius: 50%;">✅</div>
                        <h1 style="margin: 0; font-size: 28px; color: #1e293b;">Pagamento Aprovado</h1>
                        <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">${primeironome}, seu pagamento foi confirmado com sucesso!</p>
                    </div>
                    <div style="background: #f0fdf4; border-radius: 20px; padding: 30px; margin-bottom: 30px; border: 1px solid #bbf7d0; text-align: center;">
                        <p style="margin: 0; color: #166534; font-weight: 600;">Seu pedido já entrou na fila de preparação e em breve estará em suas mãos.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="${siteUrl}/rastrear-pedido?id=${order.id}" style="display: inline-block; background: #166534; color: white; padding: 18px 40px; border-radius: 15px; text-decoration: none; font-weight: 700;">Acompanhar Pedido</a>
                    </div>
                `;
                break;

            case 'producao':
                subject = `Seu pedido #${order.id.slice(0, 8)} está em produção!`;
                contentHtml = `
                    <div style="text-align: center; padding-bottom: 30px;">
                        <div style="margin-bottom: 20px; display: inline-block; background: #eff6ff; padding: 15px; border-radius: 50%;">🛠️</div>
                        <h1 style="margin: 0; font-size: 28px; color: #1e293b;">Em Produção</h1>
                        <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">Estamos preparando seus produtos com todo cuidado.</p>
                    </div>
                `;
                break;
        }

        if (contentHtml) {
            await resend.emails.send({
                from: 'Automatiza <onboarding@resend.dev>',
                to: [order.cliente_email],
                subject: subject,
                html: `
                    <div style="background-color: #f1f5f9; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);">
                            <div style="padding: 40px 20px; text-align: center; background: white; border-bottom: 1px solid #f8fafc;">
                                <img src="${logoUrl}" alt="Automatiza" style="height: 60px;" />
                            </div>
                            <div style="padding: 40px;">
                                ${contentHtml}
                            </div>
                            ${footerHtml}
                        </div>
                    </div>
                `
            });
        }

        return json({ success: true })

    } catch (err: any) {
        console.error('Email error:', err)
        return json({ error: err.message }, 500)
    }
})
