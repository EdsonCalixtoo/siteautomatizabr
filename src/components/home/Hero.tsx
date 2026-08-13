import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, CheckCircle2, Zap, ChevronDown, MessageCircle } from "lucide-react";
import { BrandSelector } from "./BrandSelector";

const stats = [
  { value: "1.000+", label: "Vans Automatizadas" },
  { value: "12 meses", label: "Garantia" },
  { value: "98%", label: "Satisfação" },
  { value: "Todo BR", label: "Entrega" },
];

const features = [
  { icon: Shield, text: "Anti-esmagamento" },
  { icon: Truck, text: "Frete Grátis" },
  { icon: Zap, text: "Instalação Fácil" },
  { icon: CheckCircle2, text: "Garantia 1 ano" },
];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#03090f]" style={{ minHeight: "100vh" }}>

      {/* ── Atmospheric Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dark blue gradient base */}
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 70% at 50% -10%, rgba(30,80,200,0.45) 0%, transparent 65%)"
        }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(rgba(100,160,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,160,255,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
        {/* Side glow accents */}
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #1e50c8 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />
        {/* Top golden line */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)" }} />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col"
        style={{ minHeight: "100vh", paddingTop: "6rem" }}>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12 lg:py-20">

          {/* ─── LEFT: Copy ─── */}
          <div className="flex flex-col gap-6 lg:gap-8">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex self-start items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold"
              style={{
                background: "rgba(251,191,36,0.08)",
                border: "1px solid rgba(251,191,36,0.3)",
                color: "#fbbf24"
              }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Líder em Automação de Vans no Brasil
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tight">
                <span className="block text-white">Portas</span>
                <span className="block text-white">Automáticas</span>
                <span className="block mt-2" style={{
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa, #93c5fd)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>Para Vans</span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-slate-400 text-lg leading-relaxed max-w-lg font-medium"
            >
              Transforme a porta manual da sua van em automática com o sistema mais confiável do mercado.
              Kit completo com instalação simples e garantia de 12 meses.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="flex flex-wrap gap-2.5"
            >
              {features.map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 border"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {/* Primary CTA */}
              <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative flex items-center gap-2.5 px-7 py-4 font-bold text-sm rounded-2xl overflow-hidden text-white"
                  style={{
                    background: "linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)",
                    boxShadow: "0 0 30px rgba(59,130,246,0.35), 0 4px 15px rgba(0,0,0,0.3)"
                  }}
                >
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)" }}
                    animate={{ x: ["-120%", "220%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                  />
                  <MessageCircle className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Fale no WhatsApp</span>
                </motion.button>
              </a>

              {/* Secondary CTA */}
              <Link to="/produtos">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-7 py-4 font-bold text-sm rounded-2xl text-white border"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(12px)"
                  }}
                >
                  Ver Produtos
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-t"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-2xl font-black text-white">{s.value}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT: Product Cards ─── */}
          <div className="flex flex-col gap-4">

            {/* Card: Com Sensor */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.6, type: "spring", stiffness: 70 }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(30,58,138,0.5), rgba(15,23,42,0.85))",
                border: "1px solid rgba(59,130,246,0.2)",
                boxShadow: "0 4px 40px rgba(29,78,216,0.15)"
              }}
            >
              <div className="h-[2px]" style={{ background: "linear-gradient(90deg, #1d4ed8, #60a5fa)" }} />
              <div className="flex items-center gap-5 p-5">
                <div className="flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <img
                    src="/ftproduto.jpeg"
                    alt="Kit com Sensor"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(59,130,246,0.2)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)" }}>
                      🔥 Mais Vendido
                    </span>
                  </div>
                  <h3 className="text-white font-black text-xl leading-tight">Kit com Sensor</h3>
                  <p className="text-slate-400 text-xs font-medium mt-0.5 mb-3">Sensor anti-esmagamento incluso</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-slate-500 text-xs">R$</span>
                    <span className="text-3xl font-black text-white tracking-tight">1.880</span>
                    <span className="text-slate-400 text-sm">,00</span>
                  </div>
                  <p className="text-blue-400 text-[11px] font-semibold mt-0.5">10x sem juros no cartão</p>
                </div>
              </div>
              <div className="px-5 pb-5">
                <Link to="/produtos">
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all"
                    style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)", boxShadow: "0 4px 15px rgba(29,78,216,0.35)" }}
                  >
                    Ver Detalhes →
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Card: Sem Sensor */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 70 }}
              className="rounded-2xl overflow-hidden flex items-center gap-4 p-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)"
              }}
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img
                  src="/ftproduto.jpeg"
                  alt="Kit sem Sensor"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Kit Básico</p>
                <h3 className="text-white font-black text-base">Sem Sensor</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-slate-500 text-xs">R$</span>
                  <span className="text-xl font-black text-white">1.680</span>
                  <span className="text-slate-500 text-xs">,00</span>
                </div>
              </div>
              <Link to="/produtos" className="flex-shrink-0">
                <div className="px-4 py-2 rounded-xl text-sm font-bold text-blue-400 border border-blue-500/25 hover:bg-blue-500/10 transition-colors whitespace-nowrap">
                  Ver →
                </div>
              </Link>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="flex items-center justify-around py-3.5 px-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Shield className="w-3.5 h-3.5 text-green-400" /> Pag. Seguro
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Truck className="w-3.5 h-3.5 text-blue-400" /> Envio Nacional
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" /> 12 meses
              </div>
            </motion.div>
          </div>
        </div>

        {/* Brand Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="pb-10"
        >
          <BrandSelector />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-slate-600" />
        </motion.div>
      </div>
    </section>
  );
}
