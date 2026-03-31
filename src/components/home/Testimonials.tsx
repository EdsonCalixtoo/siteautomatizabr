import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "João Silva",
    role: "Proprietário",
    company: "Transportes Silva",
    message: "Melhor investimento que fiz! Meus passageiros adoraram. Agora não preciso mais ficar abrindo a porta manualmente. O sistema é muito confiável.",
    rating: 5,
    avatar: "J",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Maria Santos",
    role: "Gerente Operacional",
    company: "Frota Premium",
    message: "Sistema confiável, instalação rápida e o suporte é excelente. Recomendo para qualquer empresa que queira modernizar sua frota!",
    rating: 5,
    avatar: "M",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Carlos Oliveira",
    role: "Motorista Autônomo",
    company: "Transportes Inteligentes",
    message: "Muito prático! Ganho muito tempo com essa automação. A qualidade é muito boa e o preço vale cada centavo. Já indiquei para vários amigos.",
    rating: 5,
    avatar: "C",
    color: "from-green-500 to-emerald-600",
  },
];

const stats = [
  { value: "500+", label: "Clientes Satisfeitos" },
  { value: "1.000+", label: "Vans Automatizadas" },
  { value: "99.8%", label: "Taxa de Satisfação" },
];

export function Testimonials() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-6">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm">+500 Avaliações 5 estrelas</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Clientes que{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              já transformaram
            </span>{" "}
            suas vans
          </h2>
          <p className="text-slate-400 text-lg">
            Veja o que nossos clientes falam sobre o sistema de automação Automatiza
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Top accent */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${t.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

              {/* Quote icon */}
              <Quote className="w-8 h-8 text-cyan-500/30 mb-4" />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Message */}
              <p className="text-slate-300 leading-relaxed text-sm mb-6 flex-1">
                "{t.message}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>

              {/* Corner decoration */}
              <div className={`absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br ${t.color} rounded-full opacity-5 group-hover:opacity-10 transition-opacity blur-xl`} />
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2 group">
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {stat.value}
                </p>
                <p className="text-slate-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
