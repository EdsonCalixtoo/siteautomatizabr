import { Phone, MessageCircle, ArrowRight, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-6 py-2 rounded-full mb-10"
          >
            <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Atendimento Especializado</span>
          </motion.div>

          {/* Title */}
          <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight uppercase">
            PRONTO PARA <br />
            <span className="text-blue-600">AS FÉRIAS?</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
            Fale agora com nosso time técnico e descubra por que o Brasil pede Automatiza para transformar o transporte.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="group">
              <button className="w-full sm:w-auto px-10 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6 fill-white" />
                CONVERSAR NO WHATSAPP
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a href="tel:+5519989429972" className="group">
              <button className="w-full sm:w-auto px-10 py-6 bg-white border border-slate-200 text-slate-700 font-bold text-lg rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                <Phone className="w-6 h-6" />
                LIGAR AGORA
              </button>
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-12 border-t border-slate-100">
            {[
              { icon: <Trophy className="w-4 h-4" />, text: "Garantia 12 meses" },
              { icon: "🚚", text: "Envio Nacional" },
              { icon: "🔒", text: "100% Seguro" },
              { icon: "🎒", text: "Volta às Aulas" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="text-blue-600">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
