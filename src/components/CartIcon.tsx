import { ShoppingCart as ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

export function CartIcon() {
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/checkout")}
      className="relative p-2.5 hover:bg-cyan-50 rounded-xl transition-all duration-300 group"
      aria-label="Ir para carrinho"
      type="button"
    >
      <ShoppingCartIcon className="w-6 h-6 text-cyan-600 group-hover:scale-110 transition-transform duration-300" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}

