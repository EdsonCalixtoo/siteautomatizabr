import { Layout } from "@/components/layout/Layout";
import { CheckCircle2, ShoppingCart, LogIn, Truck, CreditCard, CheckCircle } from "lucide-react";

export default function HowToBuy() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-cyan-50 via-cyan-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-slide-up">
            <div className="inline-flex items-center justify-center gap-2 text-cyan-600 font-semibold text-sm uppercase tracking-wider bg-cyan-100/50 px-4 py-2 rounded-full border border-cyan-200">
              <ShoppingCart className="w-4 h-4" />
              Compra Fácil e Segura
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900">
              Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-700">Comprar</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Siga nossos passos e adquira seus produtos de forma simples e segura
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Introduction */}
            <div className="bg-gradient-to-r from-cyan-50 to-cyan-100/50 p-8 rounded-xl border border-cyan-300 shadow-md mb-12">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-cyan-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                    Comprar em nossa loja é muito fácil!
                  </h2>
                  <p className="text-cyan-900 leading-relaxed">
                    Desenvolvemos um processo de compra intuitivo e seguro para sua comodidade. Siga os 6 passos abaixo e seus produtos Automatiza chegarão em breve.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-5">
              {[
                {
                  step: 1,
                  icon: ShoppingCart,
                  title: "Navegue e Selecione",
                  desc: "Navegue entre as diversas páginas de produtos (portas automáticas, lançamentos, consumíveis, destaques) e clique sobre o ícone 'Comprar'. Ou clique em 'Ver Produto' para maiores informações. O produto será inserido em seu carrinho de compras.",
                  color: "from-cyan-600 to-cyan-700"
                },
                {
                  step: 2,
                  icon: ShoppingCart,
                  title: "Continue Navegando",
                  desc: "Continue navegando em nosso site até escolher todos os produtos que você deseja adquirir. Você pode adicionar quantos itens desejar. Clique em 'Finalizar' quando estiver satisfeito com suas escolhas.",
                  color: "from-blue-600 to-blue-700"
                },
                {
                  step: 3,
                  icon: LogIn,
                  title: "Faça Login ou Cadastro",
                  desc: "Entre com seu email e senha se já possuir cadastro conosco. Caso não for cadastrado, cadastre-se rapidamente clicando no link de 'Cadastro'. O processo é rápido e seguro, e você pode gerenciar seus pedidos depois.",
                  color: "from-purple-600 to-purple-700"
                },
                {
                  step: 4,
                  icon: Truck,
                  title: "Escolha o Envio",
                  desc: "Escolha a forma de envio do produto que mais se adequa às suas necessidades. Trabalhamos com JadLog e Rodonaves para portas automáticas e Correios (Sedex) para demais produtos. Você verá o prazo estimado para cada opção.",
                  color: "from-orange-600 to-orange-700"
                },
                {
                  step: 5,
                  icon: CreditCard,
                  title: "Escolha a Forma de Pagamento",
                  desc: "Selecione a forma de pagamento mais conveniente para você: cartão de crédito, boleto, transferência bancária ou outras opções. Todos os pagamentos são processados de forma segura com criptografia SSL.",
                  color: "from-red-600 to-red-700"
                },
                {
                  step: 6,
                  icon: CheckCircle,
                  title: "Pronto!",
                  desc: "Você adquiriu seu produto Automatiza! Você receberá um email de confirmação com o número do pedido. Aguarde a confirmação de pagamento e sua encomenda será enviada em até 5 dias úteis.",
                  color: "from-cyan-600 to-cyan-700"
                }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.step}
                    className="group flex gap-6 p-6 rounded-xl bg-white border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} text-white flex items-center justify-center font-bold flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-xl font-bold text-gray-900 group-hover:text-cyan-600 transition-colors mb-2">
                        Passo {item.step}: {item.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors">
                <h3 className="font-semibold text-lg text-blue-900 mb-3 flex items-center gap-2">
                  💡 Dica
                </h3>
                <p className="text-blue-900 text-sm leading-relaxed">
                  Se tiver dúvidas sobre qual produto escolher, consulte nossas páginas de produtos ou entre em contato conosco por WhatsApp. Nossa equipe está pronta para ajudar!
                </p>
              </div>

              <div className="p-6 rounded-xl bg-cyan-50 border border-cyan-200 hover:border-cyan-300 transition-colors">
                <h3 className="font-semibold text-lg text-cyan-900 mb-3 flex items-center gap-2">
                  ✓ Segurança Garantida
                </h3>
                <p className="text-cyan-900 text-sm leading-relaxed">
                  Todos os seus dados são protegidos com criptografia SSL. Você pode comprar com confiança sabendo que suas informações pessoais e de pagamento estão seguras.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="font-heading text-3xl font-bold text-gray-900 mb-8">Perguntas Frequentes</h2>
              
              <div className="space-y-4">
                {[
                  {
                    q: "Posso comprar sem cadastro?",
                    a: "Não, é necessário fazer cadastro ou login para garantir a entrega e o acompanhamento do seu pedido. O cadastro é rápido e simples."
                  },
                  {
                    q: "Quanto tempo leva para meu pedido chegar?",
                    a: "O produto é enviado em até 5 dias úteis após a confirmação do pagamento. O prazo de entrega varia conforme a transportadora e localização."
                  },
                  {
                    q: "Qual é a melhor forma de pagamento?",
                    a: "Oferecemos várias opções: cartão de crédito, boleto e transferência bancária. Escolha a que melhor se adequa às suas necessidades."
                  },
                  {
                    q: "Posso rastrear meu pedido?",
                    a: "Sim! Você receberá um código de rastreamento por email. Você também pode contato conosco pelo número (19) 99661-0774 para informações."
                  }
                ].map((faq, i) => (
                  <div key={i} className="p-6 rounded-xl bg-gray-50 border border-gray-200 hover:border-cyan-300 transition-colors">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      ❓ {faq.q}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
