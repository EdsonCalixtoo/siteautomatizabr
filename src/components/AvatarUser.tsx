import { User } from "@supabase/supabase-js";

interface AvatarUserProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export function AvatarUser({ user, size = "md" }: AvatarUserProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  };

  // Extrair iniciais do email
  const initials = user.email
    ?.split("@")[0]
    .split("")
    .slice(0, 2)
    .map((c) => c.toUpperCase())
    .join("") || "U";

  // Gerar cor baseada no email
  const colors = [
    "from-cyan-500 to-blue-500",
    "from-blue-500 to-purple-500",
    "from-purple-500 to-pink-500",
    "from-pink-500 to-red-500",
    "from-green-500 to-cyan-500",
  ];

  const colorIndex = (user.email || "").charCodeAt(0) % colors.length;
  const bgGradient = colors[colorIndex];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${bgGradient} flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow cursor-pointer`}
      title={user.email}
    >
      {initials}
    </div>
  );
}
