import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap, ChevronDown, Shield, Truck, Award, RefreshCw, Play, ShoppingCart, User, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/CartIcon";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "juninho.caxto@gmail.com";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

const infoLinks = [
  { href: "/seguranca", label: "Segurança", icon: Shield },
  { href: "/envio", label: "Envio", icon: Truck },
  { href: "/garantia", label: "Garantia", icon: Award },
  { href: "/como-comprar", label: "Como Comprar", icon: ShoppingCart },
  { href: "/trocas-devolucoes", label: "Trocas e Devoluções", icon: RefreshCw },
  { href: "/videos-instalacao", label: "Vídeos de Instalação", icon: Play },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out px-4 py-4 md:px-8",
        isScrolled ? "py-2" : "py-4 md:py-6"
      )}
    >
      <div className={cn(
        "max-w-7xl mx-auto rounded-[2rem] transition-all duration-300 border backdrop-blur-2xl",
        isScrolled 
          ? "bg-[#061206]/90 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] px-6 py-2" 
          : "bg-[#0a150a]/60 border-white/10 shadow-sm px-8 py-4"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative">
            <div className="absolute -inset-2 bg-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
            <img 
              src="/logonovo.jpeg" 
              alt="Automatiza" 
              className={cn("transition-all duration-300 rounded-xl relative z-10", isScrolled ? "h-10" : "h-12")}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                  location.pathname === link.href
                    ? "text-slate-900 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] scale-105"
                    : "text-white/70 hover:text-yellow-400 hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Info Dropdown */}
            <div className="relative group">
              <button className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white/70 hover:text-yellow-400 hover:bg-white/5 transition-all duration-300 flex items-center gap-2">
                Informações
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform text-yellow-400" />
              </button>
              <div className="absolute top-full left-0 mt-3 w-64 bg-[#0a150a]/95 border border-blue-500/20 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-3 z-[110]">
                {infoLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center gap-3 px-5 py-3 text-xs font-black uppercase tracking-wider text-white/70 hover:bg-blue-500/10 hover:text-yellow-400 transition-all border-l-2 border-transparent hover:border-yellow-400"
                    >
                      <Icon className="w-4 h-4 text-blue-400" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-3 bg-white/5 p-1 rounded-full border border-white/5">
              <CartIcon />
              <AuthButton />
            </div>
            
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black uppercase tracking-tighter rounded-full px-8 py-6 shadow-[0_4px_15px_rgba(59,130,246,0.3)] transition-all hover:scale-105 active:scale-95 border border-blue-400/30 group">
                <Zap className="w-4 h-4 mr-2 text-yellow-400 group-hover:animate-pulse" />
                Fale Conosco
              </Button>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-3">
            <div className="p-1.5 bg-white/5 rounded-2xl border border-white/5">
              <CartIcon />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3.5 rounded-2xl bg-yellow-400 text-slate-900 shadow-[0_0_20px_rgba(250,204,21,0.3)] active:scale-95 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[110] bg-[#0a150a] animate-in fade-in slide-in-from-right duration-300 flex flex-col p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-12">
            <img src="/logonovo.jpeg" alt="Logo" className="h-10 rounded-xl" />
            <button 
              onClick={() => setIsMenuOpen(false)} 
              className="p-4 rounded-2xl bg-white/5 text-yellow-400 border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 mb-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-8 py-5 rounded-2xl text-2xl font-black uppercase tracking-tighter transition-all flex items-center justify-between",
                  location.pathname === link.href 
                    ? "bg-yellow-400 text-slate-900 shadow-xl" 
                    : "text-white/60 border border-white/5 bg-white/[0.02]"
                )}
              >
                {link.label}
                {location.pathname === link.href && <Trophy className="w-6 h-6" />}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-6 pt-12">
            <div className="grid grid-cols-2 gap-4">
              <AuthButton />
              <div className="flex items-center justify-center bg-white/5 rounded-2xl border border-white/10">
                <CartIcon />
              </div>
            </div>
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full py-10 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-xl rounded-3xl shadow-[0_10px_30px_rgba(59,130,246,0.3)] border border-blue-400/30">
                <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                CHAMAR NO WHATSAPP
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
