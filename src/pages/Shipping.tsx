import { Layout } from "@/components/layout/Layout";
import { Truck, Check, Phone, MapPin } from "lucide-react";

export default function Shipping() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-orange-50 via-orange-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-slide-up">
            <div className="inline-flex items-center justify-center gap-2 text-orange-600 font-semibold text-sm uppercase tracking-wider bg-orange-100/50 px-4 py-2 rounded-full border border-orange-200">
              <Truck className="w-4 h-4" />
              Entrega Rápida e Segura
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900">
              Envio e <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-700">Entrega</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Contamos com parceiros confiáveis para garantir sua encomenda chegue com segurança
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Prazo de Envio */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center shadow-lg">
                  <Truck className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Prazo de Envio
                </h2>
              </div>
              
              <div className="p-8 rounded-xl bg-orange-50 border border-orange-200 hover:border-orange-300 transition-colors">
                <p className="text-lg text-orange-900 leading-relaxed">
                  Todos os produtos serão enviados de acordo com a forma escolhida pelo cliente, <span className="font-semibold">em até 5 dias úteis</span> da confirmação do pagamento.
                </p>
                <div className="mt-6 p-4 bg-white rounded-lg border border-orange-100">
                  <p className="text-orange-900 text-sm">
                    <span className="font-semibold">⏱️ Prazo a partir da confirmação:</span> 5 dias úteis para processamento e envio
                  </p>
                </div>
              </div>
            </div>

            {/* Transportadoras */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Transportadoras Parceiras
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 shadow-md">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">JadLog</h3>
                  <p className="text-blue-900 text-sm mb-4">Especializada no transporte de portas automáticas com rastreamento</p>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      Rastreamento em tempo real
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      Cobertura nacional
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-cyan-50 border border-cyan-200 hover:border-cyan-300 transition-all hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center mb-4 shadow-md">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Rodonaves</h3>
                  <p className="text-cyan-900 text-sm mb-4">Transporte seguro para portas automáticas e peças de grande porte</p>
                  <ul className="space-y-2 text-sm text-cyan-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-600" />
                      Seguro completo
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-cyan-600" />
                      Entrega programada
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-purple-50 border border-purple-200 hover:border-purple-300 transition-all hover:shadow-md">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 shadow-md">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Correios (Sedex)</h3>
                  <p className="text-purple-900 text-sm mb-4">Ideal para produtos menores, peças e acessórios</p>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      Rastreamento garantido
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      Entrega rápida
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Rastreamento */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center shadow-lg">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Rastreamento
                </h2>
              </div>
              
              <div className="p-8 rounded-xl bg-cyan-50 border border-cyan-200 hover:border-cyan-300 transition-colors">
                <p className="text-lg text-cyan-900 leading-relaxed mb-4">
                  Para obter informações e rastrear sua encomenda em tempo real, entre em contato:
                </p>
                <div className="bg-white p-6 rounded-lg border border-cyan-200 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Suporte de Envios</p>
                    <p className="text-2xl font-bold text-cyan-600">(19) 99661-0774</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Aviso Importante */}
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
              <p className="text-yellow-900">
                <span className="font-semibold">⚠️ Importante:</span> O prazo para a entrega varia de acordo com a forma de envio escolhida 
                e localização de destino. A Automatiza não é responsável por atrasos causados pelas transportadoras. Todos os prazos são estimados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
