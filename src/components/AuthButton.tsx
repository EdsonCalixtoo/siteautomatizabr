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
        className="rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-10 h-10"
      >
        <User className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          <AvatarUser user={user} size="md" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-[#0a150a]/95 border border-green-500/20 backdrop-blur-xl rounded-2xl shadow-2xl p-2 z-[110]"
      >
        <div className="px-3 py-2.5">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-400">Usuário</p>
          <p className="text-sm font-bold text-white truncate mt-0.5">{user.email}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-400/80 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Autenticado
          </p>
        </div>
        <DropdownMenuSeparator className="bg-white/10 my-1" />
        <DropdownMenuItem 
          onClick={() => navigate("/minha-conta")} 
          className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-white/70 hover:bg-white/5 hover:text-yellow-400 rounded-xl transition-all focus:bg-white/5 focus:text-yellow-400"
        >
          <User className="w-4 h-4 text-green-400" />
          Meu Perfil
        </DropdownMenuItem>
        {user.email === ADMIN_EMAIL && (
          <DropdownMenuItem 
            onClick={() => navigate("/admin/dashboard")} 
            className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-white/70 hover:bg-white/5 hover:text-yellow-400 rounded-xl transition-all focus:bg-white/5 focus:text-yellow-400"
          >
            <Home className="w-4 h-4 text-green-400" />
            Dashboard
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="bg-white/10 my-1" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all focus:bg-red-500/10 focus:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
