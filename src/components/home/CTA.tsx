import { Phone, MessageCircle, ArrowRight, Zap, Shield, Truck, Award } from "lucide-react";
import { motion } from "framer-motion";

const trustItems = [
  { icon: Shield, text: "Pagamento Seguro" },
  { icon: Truck, text: "Envio Nacional" },
  { icon: Award, text: "Qualidade Premium" },
  { icon: Zap, text: "Suporte Técnico" },
];

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(219,234,254,0.6) 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f172a, #1e3a8a, #1d4ed8)",
            boxShadow: "0 30px 80px rgba(29,78,216,0.3), 0 0 0 1px rgba(255,255,255,0.05)"
          }}
        >
          {/* Top shimmer */}
          <div className="h-[2px]" style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
          }} />

          <div className="p-8 md:p-14 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Atendimento Especializado</span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5">
              Pronto para{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-400">
                Inovar?
              </span>
            </h2>

            <p className="text-blue-200 text-lg font-medium max-w-xl mx-auto mb-10 leading-relaxed">
              Fale agora com nosso time técnico e descubra a melhor solução para transformar o transporte da sua frota.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center justify-center gap-2.5 px-8 py-4 font-bold text-base rounded-2xl text-slate-900"
                  style={{
                    background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                    boxShadow: "0 8px 30px rgba(251,191,36,0.35)"
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  Conversar no WhatsApp
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
              <a href="tel:+5519989429972">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 font-bold text-base rounded-2xl text-white border"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(12px)"
                  }}
                >
                  <Phone className="w-5 h-5" />
                  Ligar Agora
                </motion.button>
              </a>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-white/10">
              {trustItems.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                  <Icon className="w-3.5 h-3.5 text-blue-300" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
