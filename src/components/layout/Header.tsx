import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap, ChevronDown, Shield, Truck, Award, RefreshCw, Play, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/CartIcon";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ADMIN_EMAIL = "gugaeduardo30@gmail.com";

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
        "max-w-7xl mx-auto rounded-[2rem] transition-all duration-300 border backdrop-blur-xl",
        isScrolled 
          ? "bg-white/80 border-slate-200/50 shadow-lg px-6 py-2" 
          : "bg-white/40 border-white/20 shadow-sm px-8 py-4"
      )}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/logonovo.jpeg" 
              alt="Automatiza" 
              className={cn("transition-all duration-300 rounded-xl", isScrolled ? "h-10" : "h-12")}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-5 py-2 rounded-xl font-bold text-sm transition-all duration-300",
                  location.pathname === link.href
                    ? "text-green-600 bg-green-50"
                    : "text-slate-600 hover:text-green-600 hover:bg-green-50/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Info Dropdown */}
            <div className="relative group">
              <button className="px-5 py-2 rounded-xl font-bold text-sm text-slate-600 hover:text-green-600 hover:bg-green-50/50 transition-all duration-300 flex items-center gap-1">
                Informações
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                {infoLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                    >
                      <Icon className="w-4 h-4 text-green-600" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            <CartIcon />
            <AuthButton />
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-full px-6 shadow-md transition-all hover:scale-105 active:scale-95">
                <Zap className="w-4 h-4 mr-2" />
                Fale Conosco
              </Button>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center gap-3">
            <CartIcon />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-2xl bg-green-600 text-white shadow-lg active:scale-95 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[110] bg-white animate-in fade-in slide-in-from-right duration-300 flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <img src="/logonovo.jpeg" alt="Logo" className="h-10 rounded-xl" />
            <button onClick={() => setIsMenuOpen(false)} className="p-3 rounded-2xl bg-slate-100 text-slate-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 mb-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "px-6 py-4 rounded-2xl text-xl font-bold transition-all",
                  location.pathname === link.href ? "bg-green-50 text-green-600" : "text-slate-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="block">
              <Button className="w-full py-8 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-2xl shadow-xl">
                <Zap className="w-5 h-5 mr-3" />
                ATENDIMENTO WHATSAPP
              </Button>
            </a>
            <AuthButton />
          </div>
        </div>
      )}
    </header>
  );
}
