import { motion } from "framer-motion";

export const AnimatedVan = () => {
  return (
    <div className="relative w-[340px] h-[180px] drop-shadow-2xl scale-[1.5] md:scale-[2] origin-left">
      <motion.div
        className="absolute inset-0"
        initial={{ x: '-150vw' }}
        animate={{ x: '150vw' }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
      >
        {/* Van Shadow */}
        <div className="absolute bottom-4 left-4 right-4 h-4 bg-black/40 blur-md rounded-full" />

        {/* Van Body */}
        <div className="absolute bottom-6 left-0 w-full h-[110px] bg-gradient-to-b from-white to-slate-200 rounded-2xl rounded-tl-[3.5rem] rounded-tr-[2.5rem] shadow-xl border-b-8 border-slate-300">
          
          {/* Roof */}
          <div className="absolute top-0 w-full h-5 bg-white rounded-t-2xl rounded-tl-[3.5rem] rounded-tr-[2.5rem] opacity-95 shadow-sm" />
          
          {/* Windows Area */}
          <div className="absolute top-5 left-3 right-3 h-14 flex gap-2">
            {/* Driver Window */}
            <div className="flex-1 bg-slate-900 rounded-l-[2rem] rounded-r-md border-2 border-slate-800 relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
            
            {/* Interior behind Sliding Door */}
            <div className="flex-[1.4] bg-slate-950 rounded-md relative overflow-hidden flex items-center justify-center border-y-2 border-slate-800">
              <span className="text-white/10 text-xs font-bold tracking-widest">INTERIOR</span>
              {/* Some seats inside */}
              <div className="absolute bottom-0 right-2 w-6 h-8 bg-slate-800 rounded-t-md" />
              <div className="absolute bottom-0 left-2 w-6 h-8 bg-slate-800 rounded-t-md" />
            </div>
            
            {/* Back Window */}
            <div className="flex-[0.8] bg-slate-900 rounded-r-xl rounded-l-md border-2 border-slate-800 relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
            </div>
          </div>

          {/* Yellow Stripe (Escolar) */}
          <div className="absolute top-[82px] w-full h-5 bg-yellow-400 flex items-center overflow-hidden border-y border-yellow-500">
            <span className="text-[11px] font-black text-slate-900 tracking-[0.4em] ml-16">ESCOLAR</span>
          </div>

          {/* Headlight */}
          <div className="absolute top-16 left-[2px] w-4 h-6 bg-yellow-100 rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.8)] border border-yellow-200" />
          
          {/* Taillight */}
          <div className="absolute top-16 right-0 w-3 h-7 bg-red-500 rounded-l-full shadow-[0_0_10px_rgba(239,68,68,0.8)] border border-red-700" />

          {/* The Sliding Door */}
          <motion.div
            className="absolute top-[18px] left-[32%] w-[42%] h-[92px] bg-gradient-to-b from-white to-slate-200 border-2 border-slate-300 rounded-lg z-10 shadow-[-5px_0_15px_rgba(0,0,0,0.3)] flex flex-col"
            initial={{ x: 0 }}
            animate={{ x: '92%' }} 
            transition={{ delay: 1, duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
          >
            {/* Door Window */}
            <div className="w-[88%] h-[52px] bg-slate-900 mx-auto mt-[1px] rounded-md border-2 border-slate-800 relative overflow-hidden shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
            </div>
            {/* Door Stripe matching the body */}
            <div className="w-full h-5 bg-yellow-400 mt-[9px] relative flex items-center justify-center border-y border-yellow-500">
              <span className="text-[7px] font-black text-slate-900 tracking-[0.2em] opacity-0 group-hover:opacity-100">AUTOMATIZA</span>
            </div>
            {/* Handle */}
            <div className="absolute top-[68px] left-3 w-6 h-2 bg-slate-800 rounded-full shadow-inner" />
          </motion.div>
        </div>

        {/* Wheels */}
        <motion.div 
          className="absolute bottom-[2px] left-10 w-14 h-14 bg-slate-900 rounded-full border-4 border-[#334155] flex items-center justify-center z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: 2, ease: "linear" }}
        >
          <div className="w-7 h-7 bg-slate-300 rounded-full border-[3px] border-slate-400 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-800 rounded-full" />
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-[2px] right-12 w-14 h-14 bg-slate-900 rounded-full border-4 border-[#334155] flex items-center justify-center z-20 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: 2, ease: "linear" }}
        >
          <div className="w-7 h-7 bg-slate-300 rounded-full border-[3px] border-slate-400 flex items-center justify-center">
            <div className="w-2 h-2 bg-slate-800 rounded-full" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
