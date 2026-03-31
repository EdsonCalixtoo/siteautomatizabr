import { Resend } from 'resend';

const resend = new Resend('re_cboe1mMR_F4q4R4riBQ4UFXCLHZXUdq3w');
const siteUrl = 'https://grupoautomatiza.com.br';
const logoUrl = `${siteUrl}/logo.jpg`;

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
                    <p style="margin: 10px 0 0; color: #64748b; font-size: 16px;">Olá, Edson! Seu pagamento foi confirmado com sucesso!</p>
                    
                    <div style="background: #f0fdf4; border-radius: 20px; padding: 30px; margin: 30px 0; border: 1px solid #bbf7d0;">
                        <p style="margin: 0; color: #166534; font-weight: 600;">Seu pedido já entrou na fila de preparação e em breve estará em suas mãos.</p>
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
