import { motion } from "framer-motion";

interface MascotAnimationProps {
  className?: string;
}

export function MascotAnimation({ className }: MascotAnimationProps) {
  return (
    <motion.div 
      animate={{ 
        y: [0, -10, 0],
        scale: [1, 1.02, 1],
      }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="relative w-full h-full">
        <img
          src="/imagem mascote do brasil e automatiza vans.png"
          alt="Mascote Automatiza"
          className="w-full h-full object-contain rounded-[2.5rem] drop-shadow-[0_20px_50px_rgba(34,197,94,0.3)]"
        />
        
        {/* Logo Overlay on Shirt */}
        <div className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 w-[12%] opacity-90 mix-blend-multiply pointer-events-none">
          <img 
            src="/logonovo.jpeg" 
            alt="Logo Automatiza" 
            className="w-full h-auto rounded-lg grayscale contrast-125"
          />
        </div>
      </div>
      
      {/* Subtle Aura */}
      <div className="absolute inset-0 bg-green-500/10 blur-[60px] -z-10 rounded-full" />
    </motion.div>
  );
}
