import { Layout } from "@/components/layout/Layout";
import { Award, Check, AlertCircle, Clock, DollarSign } from "lucide-react";

export default function Warranty() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-purple-50 via-purple-50 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto space-y-4 animate-slide-up">
            <div className="inline-flex items-center justify-center gap-2 text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100/50 px-4 py-2 rounded-full border border-purple-200">
              <Award className="w-4 h-4" />
              Garantia Completa
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-gray-900">
              Termo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-700">Garantia</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl">
              Proteção total para seus produtos Automatiza
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Cobertura */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Cobertura de Garantia
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 transition-all hover:shadow-md">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      12
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Meses de Garantia</h3>
                      <p className="text-purple-900 text-sm">Para equipamentos novos</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-purple-900">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      Defeitos de fabricação
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      Problemas eletrônicos
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-600" />
                      Suporte técnico incluído
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:border-orange-300 transition-all hover:shadow-md">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                      90
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Dias de Garantia</h3>
                      <p className="text-orange-900 text-sm">Para consertos e reparos</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-orange-900">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-orange-600" />
                      Após conserto realizado
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-orange-600" />
                      Revisão completa
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-orange-600" />
                      Teste de funcionamento
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Contagem do Prazo */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Contagem do Prazo
                </h2>
              </div>
              
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-colors">
                <div className="space-y-4">
                  <p className="text-lg text-blue-900 leading-relaxed">
                    Os prazos de garantia serão contados a partir da <span className="font-semibold">data de entrega da mercadoria</span> conforme expresso na Nota Fiscal.
                  </p>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-900 text-sm"><span className="font-semibold">✓ Ativação:</span> A garantia será ativada quando o cliente comunicar o defeito expressamente (por escrito) dentro dos prazos assinalados.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Causas de Perda */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Causas de Perda de Garantia
                </h2>
              </div>
              
              <div className="space-y-3">
                {[
                  "Defeito ocasionado por uso indevido ou desacordo com as características",
                  "Alteração em placa, componentes ou tentativa de conserto não autorizado",
                  "Etiqueta de identificação adulterada, rasurada ou ausente",
                  "Instalação inadequada ou exposição a condições inadequadas",
                  "Equipamentos de terceiros ligados sem autorização prévia"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-red-50 rounded-lg border border-red-200 hover:border-red-300 transition-colors">
                    <span className="text-red-600 font-bold flex-shrink-0">⚠</span>
                    <span className="text-red-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusões */}
            <div>
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                Exclusões de Garantia
              </h3>
              
              <div className="space-y-3">
                {[
                  "Defeitos causados por descargas elétricas atmosféricas",
                  "Lâmpadas, fusíveis, baterias e materiais de natureza semelhante",
                  "Armazenamento inadequado, avarias de transporte, negligência ou abuso",
                  "Defeitos por sinistros, acidentes ou agentes externos",
                  "Equipamentos expostos a temperaturas acima de 40ºC"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    <span className="text-gray-600 font-bold flex-shrink-0">•</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Procedimento */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center shadow-lg">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Procedimento para Garantia
                </h2>
              </div>
              
              <div className="space-y-4">
                {[
                  "Enviar laudo técnico com: nome, data da compra, número de série e descrição do problema",
                  "Embalagem adequada da mercadoria (não desmontar)",
                  "Envio com Nota Fiscal de remessa para conserto",
                  "Manutenção ou substituição em aproximadamente 10 dias úteis"
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-white border border-cyan-200 hover:border-cyan-300 hover:shadow-md transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-700 text-white flex items-center justify-center font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 text-sm">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custos */}
            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-900 mb-2">Informações sobre Custos</p>
                  <p className="text-yellow-900 text-sm">
                    As despesas de transporte (ida e volta) correm por conta do cliente. A garantia não inclui visitas aos locais de instalação para localização de problemas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
