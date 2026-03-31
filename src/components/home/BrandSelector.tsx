import { useNavigate } from "react-router-dom";
import { CATEGORY_LOGOS } from "@/data/brandLogos";

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
    <div className="w-full max-w-5xl mx-auto">
      <p className="text-cyan-400 text-sm font-bold uppercase tracking-widest mb-8 text-center animate-fade-in opacity-80">
        Selecione o seu veículo:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => navigate(`/produtos?vehicle=${brand.id}`)}
            className="group relative flex flex-col items-center gap-4 p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-transparent group-hover:border-cyan-400 overflow-hidden transition-all p-2.5">
              <img 
                src={CATEGORY_LOGOS[brand.id]} 
                alt={brand.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/100?text=" + brand.name;
                }}
              />
            </div>
            <span className="text-white text-[10px] md:text-xs font-black tracking-[0.2em] group-hover:text-cyan-400 transition-colors">
              {brand.name}
            </span>
            
            {/* Hover Glow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}
