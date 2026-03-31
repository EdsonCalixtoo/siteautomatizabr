import { useNavigate } from "react-router-dom";
import { Check, ShoppingCart, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CartNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export function CartNotification({ isOpen, onClose, productName }: CartNotificationProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-cyan-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-500 p-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
            <Check className="w-10 h-10 text-white animate-bounce" />
          </div>
          
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">
            Adicionado!
          </h2>
          <p className="text-cyan-100 text-sm font-medium mt-1 italic">
            {productName || "Produto"} agora está no seu carrinho
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-8 space-y-3">
          <Button 
            onClick={() => {
              navigate("/checkout");
              onClose();
            }}
            className="w-full h-16 bg-slate-900 hover:bg-cyan-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
          >
            <ShoppingCart className="w-6 h-6" />
            FINALIZAR COMPRA
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <button 
            onClick={onClose}
            className="w-full h-14 border-2 border-slate-100 text-slate-500 hover:border-cyan-100 hover:text-cyan-600 hover:bg-cyan-50 font-bold rounded-2xl text-sm transition-all uppercase tracking-widest"
          >
            Continuar Comprando
          </button>
        </div>

        {/* Security / Info */}
        <div className="bg-slate-50 p-4 flex items-center justify-center gap-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Compra Segura
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Envio Imediato
          </div>
        </div>
      </div>
    </div>
  );
}
