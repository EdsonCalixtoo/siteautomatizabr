import { Zap, Shield, Wrench, Clock, Settings, Award } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Abertura Ultra-Rápida",
    description: "Sistema inteligente que abre e fecha a porta em apenas 3-4 segundos com precisão absoluta.",
    gradient: "from-green-500 to-green-600",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Sensor anti-esmagamento que detecta obstáculos e reverte automaticamente para evitar acidentes.",
    gradient: "from-yellow-400 to-yellow-600",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
  {
    icon: Wrench,
    title: "Instalação Fácil",
    description: "Instalação profissional sem modificações estruturais. Equipe especializada em todo Brasil.",
    gradient: "from-blue-500 to-blue-700",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Clock,
    title: "Alta Durabilidade",
    description: "Componentes industriais de alta qualidade projetados para uso intensivo diário, por anos.",
    gradient: "from-green-400 to-emerald-600",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Settings,
    title: "Compatibilidade",
    description: "Funciona com a grande maioria das vans do mercado brasileiro: Sprinter, Master, Transit e mais.",
    gradient: "from-orange-500 to-orange-700",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Award,
    title: "Garantia 12 Meses",
    description: "Cobertura total por 12 meses com suporte técnico especializado via WhatsApp todos os dias.",
    gradient: "from-green-600 to-green-800",
    color: "text-green-700",
    bg: "bg-green-50",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full mb-6 font-bold text-xs uppercase tracking-widest"
          >
            Vantagens de Campeão
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight uppercase">
            A TECNOLOGIA QUE <br />
            <span className="text-green-600">ENTRA EM CAMPO.</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
            Desenvolvemos o equipamento líder do mercado brasileiro para quem busca performance absoluta em cada quilômetro.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white border border-slate-100 rounded-3xl p-8 hover:border-green-200 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>

                <h3 className="text-slate-900 font-bold text-xl mb-3 group-hover:text-green-600 transition-colors uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
