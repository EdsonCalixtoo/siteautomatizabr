import { Link } from "react-router-dom";
import { ArrowRight, Shield, Zap, Award, Star, ChevronRight, Sparkles } from "lucide-react";
import { BrandSelector } from "./BrandSelector";

const stats = [
  { icon: Shield, value: "12", label: "Meses de Garantia", suffix: "" },
  { icon: Zap, value: "3-4", label: "Seg. de Abertura", suffix: "s" },
  { icon: Award, value: "500", label: "Vans Automatizadas", suffix: "+" },
  { icon: Star, value: "4.9", label: "Avaliação Média", suffix: "★" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: "6s", animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-400/5 rounded-full blur-[150px]" />

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
            style={{
              left: `${10 + (i * 4.5)}%`,
              top: `${15 + ((i * 3.7) % 70)}%`,
              animation: `float ${3 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/20 px-5 py-2.5 rounded-full group hover:bg-cyan-500/15 transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
              </span>
              <span className="text-cyan-300 text-sm font-semibold tracking-wide">Tecnologia de Automação Premium</span>
              <ChevronRight className="w-4 h-4 text-cyan-500 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Title */}
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px bg-amber-500/50 flex-1 max-w-[80px]" />
                <span className="text-amber-500 font-black tracking-widest text-lg uppercase flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-500" />
                  Especial de Aniversário
                  <Star className="w-5 h-5 fill-amber-500" />
                </span>
                <div className="h-px bg-amber-500/50 flex-1 max-w-[80px]" />
              </div>

              <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black leading-[0.9] text-white">
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 uppercase tracking-tighter">
                  10 ANOS
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="text-white uppercase tracking-tight">
                    AUTOMATIZA
                  </span>
                </span>
              </h1>

              <div className="flex flex-col items-center gap-4 mt-8">
                <div className="bg-white/5 backdrop-blur-md border-2 border-amber-500/30 rounded-3xl p-6 shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                  <div className="bg-amber-500/20 border-2 border-amber-500 rounded-2xl py-3 px-6 mb-4 animate-[pulse_2s_ease-in-out_infinite]">
                    <p className="text-amber-400 font-black text-sm md:text-base uppercase tracking-widest flex items-center justify-center gap-3">
                      <Sparkles className="w-5 h-5 flex-shrink-0" /> 
                      USE O CUPOM: 10ANOSAUTOMATIZA
                      <Sparkles className="w-5 h-5 flex-shrink-0" />
                    </p>
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-white flex items-center justify-center gap-4">
                    De <span className="line-through text-slate-500 text-2xl">R$ 1.680</span> 
                    <span className="text-amber-400">R$ 1.450</span>
                  </p>
                  <p className="text-slate-300 font-bold mt-2 flex items-center justify-center gap-2">
                    <span className="bg-green-500 text-white rounded-full px-3 py-0.5 text-[10px]">FRETE GRÁTIS</span>
                    em <span className="text-white text-xl">10x SEM JUROS</span> de R$ 145,00
                  </p>
                </div>
              </div>

              <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed pt-4 font-medium italic">
                "Há uma década abrindo caminhos e transformando o transporte alternativo no Brasil com tecnologia premium."
              </p>
            </div>

            {/* Brand Selector Integrated */}
            <div className="pt-8">
              <BrandSelector />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link to="/produtos">
                <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-105">
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600" />
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative text-white">Ver Todos os Produtos</span>
                  <ArrowRight className="relative w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
                  <span className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>

              <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
                <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-bold text-lg border border-slate-600 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 hover:bg-white/5 transition-all duration-300 hover:scale-105">
                  💬 Suporte WhatsApp
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-cyan-500/30 transition-all duration-300 cursor-default overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-black text-2xl leading-none">
                      {stat.value}<span className="text-cyan-400">{stat.suffix}</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" />
        </div>
        <span className="text-slate-500 text-xs">Role para baixo</span>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
