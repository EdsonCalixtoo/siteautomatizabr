import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Award, Star, Trophy, Target } from "lucide-react";
import { BrandSelector } from "./BrandSelector";

const stats = [
  { icon: Shield, value: "12", label: "Meses de Garantia", suffix: "" },
  { icon: Zap, value: "3-4", label: "Seg. de Abertura", suffix: "s" },
  { icon: Award, value: "500", label: "Vans Automatizadas", suffix: "+" },
  { icon: Star, value: "4.9", label: "Avaliação Média", suffix: "★" },
];

import { MascotAnimation } from "./MascotAnimation";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a150a]">
      {/* Background Decor - Softer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.1)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#0a150a] to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Content Left */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-1.5 rounded-full"
            >
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-green-500 font-bold text-[10px] uppercase tracking-widest">Seleção Especial 2026</span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight">
                O Brasil pede <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-yellow-400">
                  Automatiza.
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium opacity-80">
                A tecnologia líder em automação de vans, desenvolvida para quem busca máxima performance e segurança.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link to="/produtos">
                <Button className="w-full sm:w-auto px-10 py-7 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-2xl transition-all shadow-xl shadow-green-900/20">
                  Ver Escalação
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full sm:w-auto px-10 py-7 border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold text-lg">
                  Falar com o Time
                </Button>
              </a>
            </div>
          </div>

          {/* Mascot Right - More Elegant Integration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative max-w-lg lg:max-w-none"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm p-4">
              <MascotAnimation className="w-full h-auto rounded-[2.5rem]" />
            </div>
            {/* Soft Glow */}
            <div className="absolute -inset-4 bg-green-500/20 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>

        {/* Stats - Softer */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-yellow-400 font-bold text-2xl mb-1">{stat.value}{stat.suffix}</p>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Brand Selector */}
        <div className="mt-32">
          <BrandSelector />
        </div>
      </div>
    </section>
  );
}
