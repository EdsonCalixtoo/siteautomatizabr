import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PartyPopper, Sparkles, GraduationCap as regap, Gift, Zap, Copy } from "lucide-react";

export function AnniversaryCelebration() {
  const [particles, setParticles] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlBanner = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlBanner, { passive: true });
    return () => window.removeEventListener("scroll", controlBanner);
  }, [lastScrollY]);

  useEffect(() => {
    const colors = ["#fbbf24", "#3b82f6", "#06b6d4", "#eab308", "#ffffff"];
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Banner de Topo */}
      <div 
        className={`fixed left-0 right-0 z-[60] bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 overflow-hidden shadow-md transition-all duration-500 ease-in-out ${
          isVisible ? "top-0" : "-top-20"
        }`}
      >
        <motion.div 
          animate={{ x: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="container mx-auto px-2 md:px-4 flex items-center justify-center gap-2 md:gap-8 h-10 md:h-12"
        >
          <div className="hidden lg:flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-widest animate-pulse">
            <PartyPopper className="w-5 h-5" />
            10 ANOS DE SUCESSO
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 text-center">
            <button 
              onClick={() => {
                navigator.clipboard.writeText('10ANOSAUTOMATIZA');
                alert('Cupom copiado! Use no checkout.');
              }}
              className="bg-amber-950 text-white rounded-full px-3 md:px-5 py-1 md:py-1.5 text-[9px] md:text-xs font-black shadow-lg hover:scale-105 transition-transform active:scale-95 border border-white/20 flex items-center gap-1.5 md:gap-2 group"
            >
              <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400 group-hover:animate-bounce" />
              <span className="hidden xs:inline">USE O CUPOM:</span> 10ANOSAUTOMATIZA
            </button>
            <p className="text-amber-950 font-black text-[10px] md:text-base tracking-tight italic hidden xs:block">
              DE <span className="line-through opacity-60">R$ 1.680</span> POR <span className="text-xs md:text-xl">R$ 1.450</span>
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-widest animate-pulse">
            EM 10X SEM JUROS!
            <Sparkles className="w-5 h-5" />
          </div>
        </motion.div>
        
        {/* Shine effect overlay */}
        <motion.div 
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full skew-x-12"
        />
      </div>

      {/* Confetes em Background */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ top: "-5%", left: `${p.x}%`, rotate: 0, opacity: 0 }}
            animate={{
              top: "105%",
              left: `${p.x + (Math.random() * 20 - 10)}%`,
              rotate: 720,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              boxShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
            }}
          />
        ))}
      </div>
    </>
  );
}
