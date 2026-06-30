import { motion } from "framer-motion";

export const Bandeirinhas = () => {
  const colors = [
    "border-t-yellow-400",
    "border-t-blue-500",
    "border-t-red-500",
    "border-t-green-500",
    "border-t-orange-400",
    "border-t-purple-500"
  ];
  
  return (
    <div className="absolute top-0 left-0 w-full h-16 overflow-hidden z-30 pointer-events-none flex opacity-90 drop-shadow-md">
      {/* String */}
      <div className="absolute top-0 w-full h-1 bg-white/20" />
      {/* Repeating flags */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div 
          key={i} 
          className="relative flex-shrink-0 w-12 h-16 origin-top"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
        >
          {/* Flag shape (inverted triangle) */}
          <div 
            className={`w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[40px] ${
              colors[i % colors.length]
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
};

