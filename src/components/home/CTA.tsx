import { Phone, MessageCircle, ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-28 bg-gradient-to-b from-slate-950 to-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-slate-950 to-blue-900/20" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px]" />
        {/* Animated border rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-cyan-500/10 rounded-full animate-ping" style={{ animationDuration: "4s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-cyan-500/5 rounded-full animate-ping" style={{ animationDuration: "6s", animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full mb-8">
            <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm">Atendimento personalizado disponível agora</span>
          </div>

          {/* Title */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.05]">
            PRONTO PARA{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400">
              AUTOMATIZAR
            </span>{" "}
            SUA VAN.
          </h2>

          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Entre em contato agora e descubra como nosso sistema de automação pode facilitar o dia a dia dos seus passageiros e motoristas.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
              <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105">
                <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600" />
                <span className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle className="relative w-6 h-6 text-white" />
                <span className="relative text-white">WhatsApp</span>
                <ArrowRight className="relative w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.4)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </a>
            <a href="tel:+5519989429972">
              <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg border border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all duration-300 hover:scale-105">
                <Phone className="w-6 h-6" />
                (19) 98942-9972
              </button>
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-10 border-t border-white/10">
            {[
              { icon: "✅", text: "Garantia 12 meses" },
              { icon: "🚚", text: "Entrega em todo Brasil" },
              { icon: "🔒", text: "Pagamento seguro" },
              { icon: "⚡", text: "Instalação profissional" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
