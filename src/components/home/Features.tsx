import { Zap, Shield, Wrench, Clock, Settings, Award } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Abertura Ultra-Rápida",
    description: "Sistema inteligente que abre e fecha a porta em apenas 3-4 segundos com precisão absoluta.",
    gradient: "from-yellow-500 to-orange-500",
    glow: "shadow-yellow-500/20",
    bg: "from-yellow-500/10 to-orange-500/5",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Sensor anti-esmagamento que detecta obstáculos e reverte automaticamente para evitar acidentes.",
    gradient: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/20",
    bg: "from-cyan-500/10 to-blue-500/5",
  },
  {
    icon: Wrench,
    title: "Instalação Fácil",
    description: "Instalação profissional sem modificações estruturais. Equipe especializada em todo Brasil.",
    gradient: "from-violet-500 to-purple-500",
    glow: "shadow-violet-500/20",
    bg: "from-violet-500/10 to-purple-500/5",
  },
  {
    icon: Clock,
    title: "Alta Durabilidade",
    description: "Componentes industriais de alta qualidade projetados para uso intensivo diário, por anos.",
    gradient: "from-green-500 to-emerald-500",
    glow: "shadow-green-500/20",
    bg: "from-green-500/10 to-emerald-500/5",
  },
  {
    icon: Settings,
    title: "Compatibilidade",
    description: "Funciona com a grande maioria das vans do mercado brasileiro: Sprinter, Master, Transit e mais.",
    gradient: "from-pink-500 to-rose-500",
    glow: "shadow-pink-500/20",
    bg: "from-pink-500/10 to-rose-500/5",
  },
  {
    icon: Award,
    title: "Garantia 12 Meses",
    description: "Cobertura total por 12 meses com suporte técnico especializado via WhatsApp todos os dias.",
    gradient: "from-amber-500 to-yellow-500",
    glow: "shadow-amber-500/20",
    bg: "from-amber-500/10 to-yellow-500/5",
  },
];

export function Features() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-semibold text-sm tracking-wide uppercase">Benefícios Exclusivos</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Por que escolher nosso{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              sistema de automação?
            </span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Desenvolvemos um equipamento que agrega valor ao sua van e reduz o desgaste ao longo do tempo.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-default"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg ${feature.glow}`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-white font-bold text-xl mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Corner decoration */}
                <div className={`absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
