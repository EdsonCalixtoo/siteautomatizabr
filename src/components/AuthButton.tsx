import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AvatarUser } from "@/components/AvatarUser";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Home } from "lucide-react";

const ADMIN_EMAIL = "juninho.caxto@gmail.com";

export function AuthButton() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return (
      <Button 
        onClick={() => navigate("/login")} 
        size="icon"
        className="rounded-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-10 h-10"
      >
        <User className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2">
          <AvatarUser user={user} size="md" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2">
          <p className="text-sm font-semibold text-gray-900">{user.email}</p>
          <p className="text-xs text-gray-500">✓ Autenticado</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/minha-conta")} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Meu Perfil
        </DropdownMenuItem>
        {user.email === ADMIN_EMAIL && (
          <DropdownMenuItem onClick={() => navigate("/admin/dashboard")} className="cursor-pointer">
            <Home className="w-4 h-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
