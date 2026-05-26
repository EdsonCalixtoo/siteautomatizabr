import { Resend } from 'resend';

const resend = new Resend('re_cboe1mMR_F4q4R4riBQ4UFXCLHZXUdq3w');
const siteUrl = 'https://grupoautomatiza.com.br';
const logoUrl = `${siteUrl}/logonovo.jpeg`;

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: 'Automatiza <onboarding@resend.dev>',
      to: ['juninho.caxto@gmail.com'],
      subject: '📦 Pagamento Aprovado! Pedido #TEST-001',
      html: `
        <div style="background-color: #f1f5f9; padding: 60px 20px; font-family: sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1);">
                <div style="padding: 40px 20px; text-align: center; background: white; border-bottom: 1px solid #f8fafc;">
                    <img src="${logoUrl}" alt="Automatiza" style="height: 60px;" />
                </div>
                <div style="padding: 40px; text-align: center;">
                    <div style="margin-bottom: 20px; display: inline-block; background: #f0fdf4; padding: 15px; border-radius: 50%;">✅</div>
                    <h1 style="margin: 0; font-size: 28px; color: #1e293b;">Pagamento Aprovado</h1>
                    <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">Olá, Juninho! Seu pagamento foi confirmado com sucesso!</p>
                    
                    <div style="background: #f0fdf4; border-radius: 20px; padding: 30px; margin: 30px 0; border: 1px solid #bbf7d0;">
                        <p style="margin: 0; color: #166534; font-weight: 600;">Seu pedido já entrou na fila de preparação e em breve estará em suas mãos.</p>
                    </div>

                    <!-- RESUMO DO PEDIDO -->
                    <div style="margin: 30px 0; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; text-align: left; background: #fafafa;">
                        <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Resumo da Compra</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 12px 0; color: #475569; font-size: 15px;">1x KIT DUCATO - COM SENSOR</td>
                                <td style="padding: 12px 0; text-align: right; color: #1e293b; font-weight: bold;">R$ 1.850,00</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 0 0 0; color: #1e293b; font-weight: bold; font-size: 16px;">Total Pago</td>
                                <td style="padding: 15px 0 0 0; text-align: right; color: #166534; font-weight: 900; font-size: 20px;">R$ 1.850,00</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center;">
                        <a href="${siteUrl}/rastrear-pedido?id=TEST-001" style="display: inline-block; background: #166534; color: white; padding: 18px 40px; border-radius: 15px; text-decoration: none; font-weight: 700;">Acompanhar Pedido</a>
                    </div>
                </div>
                <div style="padding: 40px 20px; text-align: center; background: #ffffff;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">© 2026 Automatiza Kits e Acessórios</p>
                </div>
            </div>
        </div>
      `
    });
    console.log('Email enviado com sucesso!', data);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}

testEmail();
