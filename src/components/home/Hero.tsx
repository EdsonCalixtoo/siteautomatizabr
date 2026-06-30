import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Truck, CalendarDays, CheckCircle2, Zap, Star, Sparkles } from "lucide-react";
import { BrandSelector } from "./BrandSelector";

/* ─── Floating Particle ─── */
function Particle({ x, y, size, color, delay }: { x: string; y: string; size: number; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, zIndex: 1 }}
      animate={{ y: [0, -20, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export function Hero() {
  const navigate = useNavigate();

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a1f6e 0%, #1240b8 40%, #1a5cd8 65%, #0d3aa8 100%)",
      }}
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 55% at 22% 42%, rgba(99,179,255,0.18) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        {/* Blobs */}
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 9, repeat: Infinity }}
          className="absolute rounded-full" style={{ top: "-15%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)" }} />
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 11, repeat: Infinity, delay: 2 }}
          className="absolute rounded-full" style={{ bottom: "-20%", right: "-8%", width: "45vw", height: "45vw", background: "radial-gradient(circle, rgba(29,78,216,0.25) 0%, transparent 70%)" }} />

        {/* Stars */}
        {[
          { top: "8%", left: "3%", size: 30 }, { bottom: "25%", left: "10%", size: 44 },
          { top: "12%", right: "8%", size: 26 }, { bottom: "18%", right: "18%", size: 20 },
        ].map((s, i) => (
          <motion.div key={i} className="absolute" style={s as React.CSSProperties}
            animate={{ rotate: 360, scale: [1, 1.25, 1] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "linear" }}
          >
            <Star size={s.size} fill="currentColor" style={{ color: "#fde047", opacity: 0.65, filter: "drop-shadow(0 0 8px rgba(255,215,0,0.8))" }} />
          </motion.div>
        ))}

        {/* Particles */}
        {[
          { x: "4%", y: "15%", size: 7, color: "#FFD700", delay: 0 },
          { x: "7%", y: "70%", size: 9, color: "#FFD700", delay: 1.5 },
          { x: "1.5%", y: "42%", size: 5, color: "#93c5fd", delay: 0.8 },
          { x: "90%", y: "12%", size: 7, color: "#FFD700", delay: 1.2 },
          { x: "94%", y: "72%", size: 8, color: "#fff", delay: 2 },
          { x: "97%", y: "48%", size: 5, color: "#93c5fd", delay: 0.4 },
        ].map((p, i) => <Particle key={i} {...p} />)}

        {/* Confetti rods */}
        {[
          { top: "38%", left: "3%", color: "#f87171", rot: 20, w: 3, h: 16 },
          { top: "62%", left: "7%", color: "#4ade80", rot: -15, w: 3, h: 13 },
          { top: "30%", right: "14%", color: "#fb923c", rot: 30, w: 3, h: 15 },
          { bottom: "24%", right: "7%", color: "#c084fc", rot: -25, w: 3, h: 18 },
        ].map((c, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ ...(c as any), width: c.w, height: c.h, transform: `rotate(${c.rot}deg)`, opacity: 0.6 }}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* ── Content wrapper ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center" style={{ minHeight: "100vh", paddingTop: "7rem", paddingBottom: "2rem" }}>

        {/* 2-column grid: single on mobile, two-col at lg */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-10 items-center w-full">

          {/* ─── LEFT: copy ─── */}
          <div className="flex flex-col items-center lg:items-start gap-3 lg:gap-5 text-center lg:text-left min-w-0">

            {/* Date pill */}
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white self-center lg:self-start"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.22)" }}
            >
              <CalendarDays className="w-4 h-4 text-yellow-300 shrink-0" />
              Oferta válida até <strong className="text-yellow-300">15/07</strong>
            </motion.div>

            {/* 3D Title
              Font sizes per breakpoint:
              - Mobile  (<640px): text-6xl  = 60px  (single col, full width)
              - sm     (≥640px): text-7xl  = 72px  (single col)
              - md     (≥768px): text-8xl  = 96px  (single col)
              - lg     (≥1024px): text-5xl = 48px  (2-col, ~480px column)
              - xl     (≥1280px): text-6xl = 60px  (2-col, ~580px column)
              - 2xl    (≥1536px): text-7xl = 72px  (2-col, ~700px column)
            */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 70 }}
              className="relative w-full min-w-0"
            >
              <div className="relative inline-block w-full">
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black uppercase tracking-tight leading-[0.85] w-full break-words"
                  style={{
                    fontFamily: "'Arial Black', 'Impact', sans-serif",
                    color: "#FFE135",
                    textShadow: "0 2px 0 #cdb700, 0 4px 0 #9a8700, 0 6px 0 #685800, 0 8px 0 #362b00, 0 12px 20px rgba(0,0,0,0.45)",
                  }}
                >
                  FÉRIAS
                </h1>
                <h1
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black uppercase tracking-tight leading-[0.85] w-full break-words -mt-1"
                  style={{
                    fontFamily: "'Arial Black', 'Impact', sans-serif",
                    color: "#FFFFFF",
                    textShadow: "0 2px 0 #9fb3ee, 0 4px 0 #3e65cc, 0 6px 0 #002eaa, 0 8px 0 #001270, 0 12px 20px rgba(0,0,0,0.45)",
                  }}
                >
                  ESCOLAR
                </h1>
                {/* Sparkle — only visible, not layout-affecting */}
                <motion.div
                  className="hidden sm:block absolute -top-2 right-0 lg:-right-2 pointer-events-none"
                  animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-8 h-8 xl:w-10 xl:h-10 text-yellow-300" style={{ filter: "drop-shadow(0 0 10px rgba(255,220,0,0.9))" }} />
                </motion.div>
              </div>
            </motion.div>

            {/* Promo badge */}
            <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex flex-row flex-wrap justify-center items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 max-w-full -rotate-1 self-center lg:self-start"
              style={{
                background: "linear-gradient(135deg, #1a3ccc 0%, #0f27a8 100%)",
                borderRadius: "1rem",
                border: "2px solid white",
                boxShadow: "0 4px 0 rgba(0,0,60,0.4), 0 6px 20px rgba(0,0,80,0.3)",
              }}
            >
              <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-yellow-300 whitespace-nowrap">TEM PROMOÇÃO NA</span>
              <span className="text-xs sm:text-sm font-black uppercase tracking-wide text-white whitespace-nowrap flex items-center gap-1">AUTOMATIZA VANS 🚌</span>
            </motion.div>

            {/* Body */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-xs sm:text-sm font-semibold text-blue-100 max-w-sm leading-relaxed uppercase tracking-wide"
            >
              Prepare sua van para a volta às aulas com mais conforto e segurança.{" "}
              <span className="text-yellow-300 font-black">PREÇOS IMPERDÍVEIS!</span>
            </motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
              className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start self-center lg:self-start"
            >
              <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl"
                  style={{ background: "linear-gradient(135deg, #FFE135 0%, #FFB800 100%)", color: "#1a1a00", border: "2px solid #CC9200", boxShadow: "0 5px 0 #9A6E00, 0 6px 22px rgba(255,180,0,0.3)" }}
                >
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.5) 50%, transparent 65%)" }}
                    animate={{ x: ["-120%", "220%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "linear" }}
                  />
                  <span className="relative z-10">GARANTIR PROMOÇÃO</span>
                  <ArrowRight className="relative z-10 w-4 h-4 shrink-0" />
                </motion.button>
              </a>
              <Link to="/produtos">
                <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl text-white"
                  style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "2px solid rgba(255,255,255,0.28)", boxShadow: "0 4px 18px rgba(0,0,0,0.2)" }}
                >
                  VER PRODUTOS
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* ─── RIGHT: cards ─── */}
          <div className="flex flex-col gap-3 sm:gap-4 w-full min-w-0">

            {/* ── CARD 1 – SEM SENSOR ── */}
            <motion.div
              onClick={() => navigate("/produtos?search=sem+sensor")}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 75 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative cursor-pointer w-full min-w-0"
              style={{ borderRadius: "1.25rem" }}
            >
              {/* Neon ring */}
              <div className="absolute -inset-[2px] rounded-[1.35rem] z-0" style={{ background: "linear-gradient(135deg, #FFB800, #FFE135, #FF8C00)", filter: "blur(4px)", opacity: 0.75 }} />
              <div className="absolute -inset-[1.5px] rounded-[1.35rem] z-0" style={{ background: "linear-gradient(135deg, #FFB800, #FFE135, #FF8C00)" }} />

              <div className="relative z-10 rounded-[1.15rem] overflow-hidden" style={{ background: "linear-gradient(155deg, #fffdf0 0%, #fff8e0 60%, #fffbf0 100%)" }}>
                {/* Shimmer */}
                <motion.div className="absolute inset-0 pointer-events-none z-40"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)" }}
                  animate={{ x: ["-120%", "220%"] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
                />

                {/* Badge */}
                <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute top-0 right-4 z-30 flex items-center gap-1 text-white font-black px-3 py-1.5 rounded-b-xl text-[10px] uppercase"
                  style={{ background: "linear-gradient(180deg, #FF8C00 0%, #E05000 100%)", boxShadow: "0 3px 12px rgba(220,100,0,0.45)", border: "1.5px solid rgba(255,200,100,0.35)", borderTop: "none" }}
                >
                  🔥 MAIS VENDIDO
                </motion.div>

                <div className="flex items-center gap-3 p-4 sm:p-5 pt-8 min-w-0">
                  {/* Text — takes all remaining space */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5 truncate">Porta Automática</p>
                    <h3 className="text-base sm:text-lg lg:text-base xl:text-lg font-black uppercase text-orange-600 leading-tight mb-1.5">SEM SENSOR</h3>
                    <p className="text-xs font-bold line-through text-gray-400 mb-1">De: R$ 1.680,00</p>

                    {/* Price row */}
                    <div className="flex items-end gap-1.5 mb-2 min-w-0">
                      <div className="flex flex-col gap-0.5 mb-0.5 shrink-0">
                        <span className="text-[8px] font-black text-white bg-gray-900 px-1 py-0.5 rounded block text-center">POR</span>
                        <span className="text-[8px] font-black text-white bg-gray-900 px-1 py-0.5 rounded block text-center">R$</span>
                      </div>
                      <motion.span
                        animate={{ scale: [1, 1.022, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                        className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black leading-none tracking-tighter shrink-0"
                        style={{ background: "linear-gradient(135deg, #FF8C00 0%, #FF4400 60%, #FF8C00 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 5px rgba(255,100,0,0.35))", fontFamily: "'Arial Black', sans-serif" }}
                      >1.430</motion.span>
                      <span className="text-base font-black text-orange-600 mb-0.5 shrink-0">,00</span>
                    </div>

                    <span className="inline-flex items-center text-white font-black uppercase rounded-full px-3 py-1 mb-2.5 text-[9px] sm:text-[10px]"
                      style={{ background: "linear-gradient(135deg, #1a3ccc, #0d24a8)", boxShadow: "0 2px 8px rgba(20,40,200,0.3)" }}
                    >💳 EM ATÉ 10X SEM JUROS</span>

                    <div className="space-y-1">
                      {[{ i: "✅", t: "Garantia de 1 ano" }, { i: "🚚", t: "Frete Grátis Brasil" }].map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-xs shrink-0">{b.i}</span>
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide truncate">{b.t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product image — fixed width, won't push layout */}
                  <div className="relative shrink-0 flex items-center justify-center" style={{ width: "110px", height: "130px" }}>
                    <div className="absolute inset-0" style={{ background: "radial-gradient(circle, rgba(255,160,0,0.28) 0%, transparent 70%)", filter: "blur(6px)" }} />
                    <div className="absolute w-full h-full" style={{ background: "linear-gradient(135deg, #FFD700, #FF8C00)", clipPath: "polygon(50% 0%,58% 32%,90% 15%,75% 45%,100% 50%,75% 55%,90% 85%,58% 68%,50% 100%,42% 68%,10% 85%,25% 55%,0% 50%,25% 45%,10% 15%,42% 32%)", opacity: 0.5 }} />
                    <motion.img src="/ftproduto.jpeg" alt="Porta Sem Sensor"
                      className="relative z-10 object-contain"
                      style={{ width: "85px", maxHeight: "120px", transform: "rotate(7deg) translateY(-6%)", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }}
                      whileHover={{ rotate: 2, scale: 1.07 }} transition={{ type: "spring" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <Zap className="absolute top-1 right-1 w-4 h-4 text-yellow-400 fill-yellow-400" style={{ filter: "drop-shadow(0 0 5px #FFD700)" }} />
                    <Zap className="absolute bottom-3 left-1 w-3.5 h-3.5 text-orange-400 fill-orange-400 -rotate-12" style={{ filter: "drop-shadow(0 0 4px #FF8C00)" }} />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── CARD 2 – COM SENSOR ── */}
            <motion.div
              onClick={() => navigate("/produtos?search=com+sensor")}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 75 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="relative cursor-pointer w-full min-w-0"
              style={{ borderRadius: "1.25rem" }}
            >
              {/* Neon ring */}
              <div className="absolute -inset-[2px] rounded-[1.35rem] z-0" style={{ background: "linear-gradient(135deg, #00DD44, #00FF88, #00AA33)", filter: "blur(4px)", opacity: 0.75 }} />
              <div className="absolute -inset-[1.5px] rounded-[1.35rem] z-0" style={{ background: "linear-gradient(135deg, #00DD44, #00FF88, #00AA33)" }} />

              <div className="relative z-10 rounded-[1.15rem] overflow-hidden" style={{ background: "linear-gradient(155deg, #f0fff4 0%, #e6ffe6 60%, #f0fff4 100%)" }}>
                {/* Shimmer */}
                <motion.div className="absolute inset-0 pointer-events-none z-40"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)" }}
                  animate={{ x: ["-120%", "220%"] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "linear", delay: 1.8 }}
                />

                {/* Badge */}
                <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-0 right-4 z-30 flex items-center gap-1 text-white font-black px-3 py-1.5 rounded-b-xl text-[10px] uppercase"
                  style={{ background: "linear-gradient(180deg, #00AA00 0%, #007700 100%)", boxShadow: "0 3px 12px rgba(0,160,0,0.45)", border: "1.5px solid rgba(100,255,100,0.35)", borderTop: "none" }}
                >
                  ⭐ PREMIUM
                </motion.div>

                <div className="flex items-center gap-3 p-4 sm:p-5 pt-8 min-w-0">
                  {/* Text */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5 truncate">Porta Automática</p>
                    <h3 className="text-base sm:text-lg lg:text-base xl:text-lg font-black uppercase text-green-700 leading-tight mb-1.5">COM SENSOR</h3>
                    <p className="text-xs font-bold line-through text-gray-400 mb-1">De: R$ 1.880,00</p>

                    {/* Price row */}
                    <div className="flex items-end gap-1.5 mb-2 min-w-0">
                      <div className="flex flex-col gap-0.5 mb-0.5 shrink-0">
                        <span className="text-[8px] font-black text-white bg-gray-900 px-1 py-0.5 rounded block text-center">POR</span>
                        <span className="text-[8px] font-black text-white bg-gray-900 px-1 py-0.5 rounded block text-center">R$</span>
                      </div>
                      <motion.span
                        animate={{ scale: [1, 1.022, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                        className="text-4xl sm:text-5xl lg:text-4xl xl:text-5xl font-black leading-none tracking-tighter shrink-0"
                        style={{ background: "linear-gradient(135deg, #00CC44 0%, #008800 60%, #00CC44 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 2px 5px rgba(0,180,0,0.35))", fontFamily: "'Arial Black', sans-serif" }}
                      >1.750</motion.span>
                      <span className="text-base font-black text-green-700 mb-0.5 shrink-0">,00</span>
                    </div>

                    <span className="inline-flex items-center text-white font-black uppercase rounded-full px-3 py-1 mb-2.5 text-[9px] sm:text-[10px]"
                      style={{ background: "linear-gradient(135deg, #1a3ccc, #0d24a8)", boxShadow: "0 2px 8px rgba(20,40,200,0.3)" }}
                    >💳 EM ATÉ 10X SEM JUROS</span>

                    <div className="space-y-1">
                      {[{ i: "🛡️", t: "Anti-esmagamento" }, { i: "✅", t: "Garantia de 1 ano" }].map((b, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-xs shrink-0">{b.i}</span>
                          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide truncate">{b.t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product image */}
                  <div className="relative shrink-0 flex items-center justify-center" style={{ width: "110px", height: "130px" }}>
                    <div className="absolute inset-0" style={{ background: "radial-gradient(circle, rgba(0,200,80,0.28) 0%, transparent 70%)", filter: "blur(6px)" }} />
                    <div className="absolute w-full h-full" style={{ background: "linear-gradient(135deg, #00DD55, #00AA33)", clipPath: "polygon(50% 0%,58% 32%,90% 15%,75% 45%,100% 50%,75% 55%,90% 85%,58% 68%,50% 100%,42% 68%,10% 85%,25% 55%,0% 50%,25% 45%,10% 15%,42% 32%)", opacity: 0.45 }} />
                    <motion.div className="absolute inset-6 rounded-full border-4 border-green-400"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
                    <motion.img src="/ftproduto.jpeg" alt="Porta Com Sensor"
                      className="relative z-10 object-contain"
                      style={{ width: "85px", maxHeight: "120px", transform: "rotate(-6deg) translateY(-6%)", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4))" }}
                      whileHover={{ rotate: -1, scale: 1.07 }} transition={{ type: "spring" }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <Zap className="absolute top-1 right-1 w-4 h-4 text-green-400 fill-green-400" style={{ filter: "drop-shadow(0 0 5px #00FF44)" }} />
                    <Zap className="absolute bottom-3 left-1 w-3.5 h-3.5 text-emerald-300 fill-emerald-300 rotate-12" style={{ filter: "drop-shadow(0 0 4px #00DD44)" }} />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Brand Selector */}
        <div className="mt-8 sm:mt-12 xl:mt-20 relative z-20">
          <BrandSelector />
        </div>
      </div>
    </section>
  );
}
