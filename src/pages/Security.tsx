import { Layout } from "@/components/layout/Layout";
import { Shield, Check, Lock } from "lucide-react";

export default function Security() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 via-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-slide-up">
            <div className="inline-flex items-center justify-center gap-2 text-blue-600 font-semibold text-sm uppercase tracking-wider bg-blue-100/50 px-4 py-2 rounded-full border border-blue-200">
              <Lock className="w-4 h-4" />
              Proteção Garantida
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900">
              Segurança <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700">de Dados</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Seus dados pessoais e transações estão protegidos com a mais alta segurança
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Proteção de Dados */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Proteção de Dados Pessoais
                </h2>
              </div>
              
              <div className="p-8 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors">
                <p className="text-lg text-blue-900 leading-relaxed mb-4">
                  Com relação aos seus dados pessoais de endereçamento, pagamento e conteúdo do pedido, você pode estar certo de que <span className="font-semibold">não serão utilizados para outros fins</span> que não o de processamento dos pedidos realizados.
                </p>
                <p className="text-lg text-blue-900 leading-relaxed">
                  Seus dados <span className="font-semibold">não serão divulgados em hipótese alguma</span> a terceiros, garantindo sua privacidade total e proteção completa.
                </p>
              </div>
            </div>

            {/* Criptografia SSL */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Criptografia SSL
                </h2>
              </div>
              
              <div className="p-8 rounded-xl bg-cyan-50 border border-cyan-200 hover:border-cyan-300 transition-colors">
                <p className="text-lg text-cyan-900 leading-relaxed mb-6">
                  Toda transação que envolver pagamento, seja por cartão de crédito ou não, estará <span className="font-semibold">encriptada com a tecnologia SSL (Secure Socket Layer)</span>.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-4 bg-white rounded-lg border border-cyan-100">
                    <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-cyan-900"><span className="font-semibold">Criptografia de ponta a ponta</span> - Seus dados viajam protegidos</span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-white rounded-lg border border-cyan-100">
                    <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-cyan-900"><span className="font-semibold">Acesso exclusivo</span> - Apenas nossa empresa tem acesso aos seus dados</span>
                  </li>
                  <li className="flex items-start gap-3 p-4 bg-white rounded-lg border border-cyan-100">
                    <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-cyan-900"><span className="font-semibold">Certificado SSL válido</span> - Protocolo HTTPS ativo em toda a plataforma</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Resumo Segurança */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Sua Segurança é Nossa Prioridade
              </h3>
              <p className="text-blue-50 leading-relaxed">
                Investimos continuamente em segurança de dados e infraestrutura para garantir que sua experiência de compra seja segura, confiável e protegida em todos os momentos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
