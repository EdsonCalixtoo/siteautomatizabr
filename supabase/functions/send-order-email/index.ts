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

        const logoUrl = "https://grupoautomatiza.com.br/logo.jpg";
        const primaryColor = "#0891b2"; // Ciano escuro elegante

        const itemsHtml = order.itens.map((item: any) => `
            <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px;">${item.name}</td>
                <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; text-align: center; color: #64748b; font-size: 14px;">${item.quantity}x</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: 600; color: #1e293b; font-size: 14px;">R$ ${item.price.toFixed(2)}</td>
            </tr>
        `).join('')

        const baseStyles = `
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        `;

        const headerHtml = `
            <div style="background: linear-gradient(135deg, ${primaryColor} 0%, #0e7490 100%); padding: 40px 20px; text-align: center;">
                <img src="${logoUrl}" alt="Automatiza" style="height: 60px; margin-bottom: 20px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));" />
            </div>
        `;

        const footerHtml = `
            <div style="background-color: #f8fafc; padding: 40px 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0 0 10px; font-weight: 700; color: #1e293b; font-size: 14px;">Automatiza Kits e Acessórios</p>
                <p style="margin: 0 0 20px; color: #64748b; font-size: 12px;">R. Dr. Élton César, 910 - Campinas, SP</p>
                <div style="margin-bottom: 25px;">
                    <a href="https://wa.me/5519989429872" style="background-color: #22c55e; color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-block;">Falar no WhatsApp</a>
                </div>
                <p style="margin: 0; color: #94a3b8; font-size: 11px;">© 2026 Automatiza. Todos os direitos reservados.</p>
            </div>
        `;

        let subject = "";
        let contentHtml = "";

        switch (type) {
            case 'novo_pedido':
                // Notificação para o Administrador
                await resend.emails.send({
                    from: 'Automatiza <vendas@grupoautomatiza.com.br>',
                    to: ['juninho.caxto@gmail.com'],
                    subject: `🔔 NOVO PEDIDO: #${order.id.slice(0, 8)}`,
                    html: `
                        <div style="${baseStyles}">
                            ${headerHtml}
                            <div style="padding: 40px;">
                                <h1 style="margin: 0 0 16px; color: #1e293b; font-size: 22px;">Novo Pedido Recebido! 🛍️</h1>
                                <p style="margin-bottom: 24px;">Um novo pedido acaba de entrar no sistema. Confira os detalhes abaixo:</p>
                                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #e2e8f0;">
                                    <p style="margin: 0 0 8px;"><strong>Cliente:</strong> ${order.cliente_nome}</p>
                                    <p style="margin: 0 0 8px;"><strong>E-mail:</strong> ${order.cliente_email}</p>
                                    <p style="margin: 0 0 8px;"><strong>Total:</strong> R$ ${order.total.toFixed(2)}</p>
                                    <p style="margin: 0;"><strong>Método:</strong> ${order.metodo_pagamento.toUpperCase()}</p>
                                </div>
                                <table style="width: 100%; border-collapse: collapse;">${itemsHtml}</table>
                                <div style="margin-top: 30px; text-align: center;">
                                    <a href="https://automatiza1.vercel.app/admin/pedidos" style="background: ${primaryColor}; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">Ver no Painel Admin</a>
                                </div>
                            </div>
                            ${footerHtml}
                        </div>
                    `
                });

                // E-mail para o Cliente (Aguardando Pagamento)
                subject = `Seu pedido #${order.id.slice(0, 8)} foi recebido! 🙌`;
                contentHtml = `
                    <h1 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; text-align: center;">Pedido Recebido!</h1>
                    <p style="margin-bottom: 30px; text-align: center; color: #64748b;">Olá, ${order.cliente_nome.split(' ')[0]}! Estamos processando seu pedido de <strong>${order.id.slice(0, 8)}</strong>.</p>
                    <div style="background: #fdfaf3; border: 1px solid #fef3c7; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
                        <span style="font-size: 14px; color: #92400e; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">Aguardando Pagamento</span>
                        <p style="margin: 0; color: #b45309; font-size: 15px;">Assim que o pagamento for confirmado, iniciaremos a preparação dos seus kits.</p>
                    </div>
                    <h3 style="color: #1e293b; font-size: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; margin-bottom: 15px;">Resumo dos Itens</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">${itemsHtml}</table>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 32px;">
                        <div style="display: flex; justify-content: space-between; font-weight: 800; color: ${primaryColor}; font-size: 18px;">
                            <span>Total a Pagar:</span>
                            <span>R$ ${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://automatiza1.vercel.app/finalizar-pagamento?orderId=${order.id}" style="background: linear-gradient(135deg, ${primaryColor} 0%, #0e7490 100%); color: white; padding: 18px 40px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(8, 145, 178, 0.3);">Pagar Agora</a>
                    </div>
                `;
                break;

            case 'pagamento_aprovado':
                subject = `Pagamento Confirmado! Pedido #${order.id.slice(0, 8)} 💳`;
                contentHtml = `
                    <h1 style="margin: 0 0 16px; color: #059669; font-size: 24px; text-align: center;">Pagamento Aprovado!</h1>
                    <p style="margin-bottom: 30px; text-align: center; color: #64748b;">Tudo certo, ${order.cliente_nome.split(' ')[0]}! Seu pagamento foi confirmado e seu pedido já está na fila de processamento.</p>
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
                        <p style="margin: 0; color: #15803d; font-weight: 600;">O próximo passo é a **produção**. Você receberá um novo e-mail assim que seus kits forem preparados.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://automatiza1.vercel.app/rastrear-pedido?id=${order.id}" style="background: #059669; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">Acompanhar Pedido</a>
                    </div>
                `;
                break;

            case 'producao':
                subject = `Pedido #${order.id.slice(0, 8)} entrou em produção! 🛠️`;
                contentHtml = `
                    <h1 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; text-align: center;">Em Produção</h1>
                    <p style="margin-bottom: 30px; text-align: center; color: #64748b;">Boas notícias! Seus kits estão sendo preparados e testados pela nossa equipe agora mesmo.</p>
                    <div style="text-align: center; margin: 40px 0;">
                        <div style="display: inline-block; background: #e0f2fe; padding: 20px; border-radius: 50%; margin-bottom: 15px;">
                            <span style="font-size: 40px;">🛠️</span>
                        </div>
                    </div>
                    <p style="text-align: center; color: #64748b;">Garantimos o máximo de qualidade em cada detalhe. Assim que estiver pronto para envio, te avisaremos!</p>
                `;
                break;

            case 'retirado':
                subject = `Pedido #${order.id.slice(0, 8)} está a caminho! 🚚`;
                contentHtml = `
                    <h1 style="margin: 0 0 16px; color: #1e293b; font-size: 24px; text-align: center;">Pedido Enviado!</h1>
                    <p style="margin-bottom: 30px; text-align: center; color: #64748b;">Seu pedido foi retirado pela transportadora e já está a caminho do seu endereço.</p>
                    <div style="background: #f8fafc; border-radius: 16px; padding: 30px; text-align: center; margin-bottom: 32px; border: 2px dashed #cbd5e1;">
                        <span style="font-size: 40px; display: block; margin-bottom: 10px;">🚚</span>
                        <p style="margin: 0; color: #1e293b; font-weight: 700;">Em breve você poderá rastrear o trajeto exato.</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="https://automatiza1.vercel.app/rastrear-pedido?id=${order.id}" style="background: ${primaryColor}; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">Rastrear nos Correios/Transportadora</a>
                    </div>
                `;
                break;
        }

        if (contentHtml) {
            await resend.emails.send({
                from: 'Automatiza <vendas@grupoautomatiza.com.br>',
                to: [order.cliente_email],
                subject: subject,
                html: `
                    <div style="background-color: #f1f5f9; padding: 40px 20px;">
                        <div style="${baseStyles}">
                            ${headerHtml}
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
