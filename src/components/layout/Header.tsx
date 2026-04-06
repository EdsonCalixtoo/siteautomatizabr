import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Zap, ChevronDown, Shield, Truck, Award, RefreshCw, Play, ShoppingCart } from "lucide-react";
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
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Sempre mostra no topo absoluto
      if (currentScrollY < 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Rolando para baixo
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true); // Rolando para cima
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <header 
      className={cn(
        "fixed left-0 right-0 z-50 pointer-events-none transition-all duration-500 ease-in-out",
        isVisible ? "top-14 md:top-16" : "-top-32"
      )}
    >
      <div className="px-4 flex justify-center pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-3xl border border-cyan-100/30 rounded-2xl w-fit">
          <div className="px-4">
            <div className="flex items-center justify-between h-20 gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity group">
              <div className="relative">
                <img 
                  src="/logonovo.jpeg" 
                  alt="Automatiza - Automação de Vans" 
                  className="h-14 w-auto rounded-xl shadow-sm"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg font-medium transition-all duration-300 text-sm",
                    location.pathname === link.href
                      ? "text-cyan-600 bg-cyan-50 border border-cyan-200"
                      : "text-gray-700 hover:text-cyan-600 hover:bg-cyan-50/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Info Dropdown */}
              <div className="relative group ml-1">
                <button className="px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-cyan-600 hover:bg-cyan-50/50 transition-all duration-300 flex items-center gap-1 text-sm">
                  Informações
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur border border-cyan-100/30 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                  {infoLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-cyan-50 hover:text-cyan-600 transition-colors group/item"
                      >
                        <Icon className="w-4 h-4 text-cyan-600 group-hover/item:scale-110 transition-transform" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <CartIcon />
              <AuthButton />
              <a 
                href="https://wa.me/5519989429972" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button 
                  size="default" 
                  className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white gap-2 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                >
                  <Zap className="w-4 h-4" />
                  Fale Conosco
                </Button>
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-4">
              <CartIcon />
              <button
                className="p-2.5 rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Mobile Menu Overlay - Full Screen independent of nav bar container */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-white flex flex-col animate-in fade-in duration-300 pointer-events-auto">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col h-full pt-24 px-8 pb-10">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-4 rounded-2xl bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-all border border-cyan-100 active:scale-95 shadow-lg"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
              <nav className="flex flex-col gap-3">
                <p className="text-cyan-600 text-[11px] font-black uppercase tracking-[0.4em] mb-6 px-4 opacity-70">
                  Menu Principal
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "px-5 py-5 rounded-[2rem] font-black text-2xl transition-all duration-300 flex items-center justify-between group",
                      location.pathname === link.href
                        ? "bg-gradient-to-r from-cyan-600/10 to-transparent text-cyan-600 border-l-4 border-cyan-500"
                        : "text-slate-600 hover:text-cyan-600 hover:translate-x-2"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                    <Zap className={cn("w-5 h-5 opacity-0 group-hover:opacity-100 transition-all", location.pathname === link.href && "opacity-100")} />
                  </Link>
                ))}
                
                {/* Mobile Info Section */}
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className="w-full px-5 py-4 rounded-2xl font-bold text-xl text-slate-700 flex items-center justify-between transition-all bg-slate-50"
                  >
                    <span className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-cyan-600" />
                      Informações
                    </span>
                    <ChevronDown className={cn("w-6 h-6 transition-transform duration-500", isInfoOpen && "rotate-180")} />
                  </button>
                  
                  {isInfoOpen && (
                    <div className="mt-4 grid grid-cols-1 gap-3 animate-in slide-in-from-top-4 duration-500">
                      {infoLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            className="flex items-center gap-5 px-6 py-5 text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-3xl transition-all font-bold text-base"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center border border-cyan-100">
                              <Icon className="w-6 h-6 text-cyan-600" />
                            </div>
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>

              <div className="mt-auto space-y-5 pt-16">
                <a 
                  href="https://wa.me/5519989429972" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    size="lg" 
                    className="w-full h-20 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white gap-4 font-black rounded-3xl shadow-xl text-xl uppercase tracking-widest transition-all active:scale-[0.98]"
                  >
                    <Zap className="w-6 h-6 animate-pulse" />
                    ATENDIMENTO VIP
                  </Button>
                </a>

                <Link
                  to="/minha-conta"
                  className="block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full h-18 border-cyan-100 bg-white text-slate-700 hover:bg-slate-50 font-black rounded-3xl text-lg uppercase tracking-tighter"
                  >
                    👤 Minha Conta
                  </Button>
                </Link>

                {user && user.email === ADMIN_EMAIL && (
                  <Link
                    to="/admin/dashboard"
                    className="block opacity-60 hover:opacity-100 transition-opacity"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="text-center py-2 text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">
                      Painel Administrador
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
