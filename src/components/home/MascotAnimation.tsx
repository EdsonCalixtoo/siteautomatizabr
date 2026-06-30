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
          src="/mascote automatiza.png"
          alt="Mascote Automatiza"
          className="w-full h-full object-contain rounded-[2.5rem] drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
        />
        

      </div>
      
      {/* Subtle Aura */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[60px] -z-10 rounded-full" />
    </motion.div>
  );
}
