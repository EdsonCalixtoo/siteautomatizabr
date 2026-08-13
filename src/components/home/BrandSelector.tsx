import { useNavigate } from "react-router-dom";
import { CATEGORY_LOGOS } from "@/data/brandLogos";
import { motion } from "framer-motion";

const brands = [
  { id: "mercedes-sprinter", name: "SPRINTER" },
  { id: "renault-master", name: "MASTER" },
  { id: "fiat-ducato", name: "DUCATO" },
  { id: "iveco-daily", name: "DAILY" },
  { id: "ford-transit", name: "TRANSIT" },
  { id: "peugeot-boxer", name: "BOXER" },
];

export function BrandSelector() {
  const navigate = useNavigate();

  return (
    <div className="w-full relative py-12 px-4 md:px-8 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] border border-white/10 shadow-[0_20px_100px_rgba(0,0,0,0.5)] overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16 gap-8 relative z-10">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-blue-600 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">
            Compatibilidade
          </div>
          <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tighter">
            SUA <span className="text-yellow-400">VAN</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
        {brands.map((brand, index) => (
          <motion.button
            key={brand.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/produtos?vehicle=${brand.id}`)}
            className="group relative flex flex-col items-center gap-8 p-10 bg-black/40 hover:bg-white/5 rounded-[3rem] border border-white/5 hover:border-yellow-400/30 transition-all duration-500 hover:-translate-y-4"
          >
            {/* Logo Wrapper */}
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center shadow-2xl p-6 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                <img
                  src={CATEGORY_LOGOS[brand.id]}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <span className="text-white text-[10px] font-black tracking-[0.3em] group-hover:text-yellow-400 transition-colors uppercase">
                {brand.name}
              </span>
              <div className="w-6 h-1 bg-white/20 rounded-full group-hover:w-full group-hover:bg-yellow-500 transition-all duration-500" />
            </div>

            <div className="absolute top-4 right-4 text-white/5 text-4xl font-black italic group-hover:text-yellow-400/10 transition-colors">
              {index + 1}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
