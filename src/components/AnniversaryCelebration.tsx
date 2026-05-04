import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnniversaryCelebration() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const symbols = ["⚽", "🏆", "🥅", "🇧🇷"];
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 15 + 15,
      duration: Math.random() * 8 + 8,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10] overflow-hidden">
      {/* Chuva de Emojis mais sutil */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ top: "-10%", left: `${p.x}%`, rotate: 0, opacity: 0 }}
          animate={{
            top: "110%",
            left: `${p.x + (Math.random() * 20 - 10)}%`,
            rotate: 360,
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            fontSize: p.size,
            filter: "blur(0.5px)",
            userSelect: "none",
          }}
        >
          {p.symbol}
        </motion.div>
      ))}

      {/* Stadium Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.05)_0%,transparent_50%)]" />
    </div>
  );
}
