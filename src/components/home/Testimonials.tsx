import { Star, Quote, TrendingUp, Users, Award } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "João Silva",
    role: "Transportes Silva",
    message: "Melhor investimento que fiz! Meus passageiros adoraram. Não preciso mais abrir a porta manualmente. Sistema muito confiável.",
    rating: 5,
    avatar: "J",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    name: "Maria Santos",
    role: "Frota Premium",
    message: "Sistema confiável, instalação rápida e o suporte é excelente. Recomendo para qualquer empresa que queira modernizar sua frota!",
    rating: 5,
    avatar: "M",
    gradient: "from-violet-600 to-violet-400",
  },
  {
    name: "Carlos Oliveira",
    role: "Motorista Autônomo",
    message: "Muito prático! Ganho muito tempo com essa automação. A qualidade é muito boa e o preço vale cada centavo. Já indiquei para vários amigos.",
    rating: 5,
    avatar: "C",
    gradient: "from-emerald-600 to-emerald-400",
  },
];

const stats = [
  { value: "500+", label: "Clientes Satisfeitos", icon: Users },
  { value: "1.000+", label: "Vans Automatizadas", icon: TrendingUp },
  { value: "99%", label: "Taxa de Satisfação", icon: Award },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-full mb-5"
          >
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest">+500 Avaliações 5 Estrelas</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white leading-tight"
          >
            O que nossos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              clientes
            </span>{" "}
            falam
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <Quote className="w-6 h-6 text-white/10" />

              {/* Message */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1 font-medium">
                "{t.message}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.name}</p>
                  <p className="text-slate-500 text-xs font-medium">{t.role}</p>
                </div>
              </div>

              {/* Top accent on hover */}
              <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r ${t.gradient} opacity-0 group-hover:opacity-60 transition-opacity`} />
            </motion.div>
          ))}
        </div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          style={{
            background: "linear-gradient(145deg, rgba(30,58,138,0.3), rgba(15,23,42,0.5))",
            border: "1px solid rgba(59,130,246,0.2)"
          }}
        >
          {stats.map(({ value, label, icon: Icon }, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.25)" }}>
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-4xl font-black text-white tracking-tight">{value}</p>
              <p className="text-slate-500 text-sm font-semibold">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
