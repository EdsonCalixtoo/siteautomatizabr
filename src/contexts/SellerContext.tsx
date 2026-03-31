import { createContext, useContext, useState, useEffect } from "react";

// Função para gerar UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  categories: string[];
  totalSales: number;
  commissionRate: number;
}

interface SellerContextType {
  sellers: Seller[];
  addSeller: (seller: Omit<Seller, "id" | "totalSales">) => void;
  updateSeller: (id: string, seller: Omit<Seller, "id" | "totalSales">) => void;
  deleteSeller: (id: string) => void;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

// Vendedores padrão
const DEFAULT_SELLERS: Seller[] = [
  {
    id: "seller_1",
    name: "Gustavo",
    email: "gustavo@automatiza.com",
    phone: "(11) 98765-4321",
    avatar: "G",
    categories: ["Kits Completos"],
    totalSales: 0,
    commissionRate: 10,
  },
  {
    id: "seller_2",
    name: "Delly",
    email: "delly@automatiza.com",
    phone: "(11) 99876-5432",
    avatar: "D",
    categories: ["Cremalheira", "Peças Individuais"],
    totalSales: 0,
    commissionRate: 8,
  },
  {
    id: "seller_3",
    name: "Maria Silva",
    email: "maria@automatiza.com",
    phone: "(11) 97654-3210",
    avatar: "M",
    categories: ["Acessórios", "Manutenção"],
    totalSales: 0,
    commissionRate: 12,
  },
];

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [sellers, setSellers] = useState<Seller[]>([]);

  // Carregar vendedores do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sellers");
    if (saved) {
      try {
        setSellers(JSON.parse(saved));
      } catch {
        setSellers(DEFAULT_SELLERS);
      }
    } else {
      setSellers(DEFAULT_SELLERS);
      localStorage.setItem("sellers", JSON.stringify(DEFAULT_SELLERS));
    }
  }, []);

  // Salvar quando vendedores mudam
  useEffect(() => {
    if (sellers.length > 0) {
      localStorage.setItem("sellers", JSON.stringify(sellers));
    }
  }, [sellers]);

  const addSeller = (seller: Omit<Seller, "id" | "totalSales">) => {
    const newSeller: Seller = {
      ...seller,
      id: generateUUID(),
      totalSales: 0,
    };
    setSellers([...sellers, newSeller]);
  };

  const updateSeller = (id: string, seller: Omit<Seller, "id" | "totalSales">) => {
    setSellers(
      sellers.map((s) =>
        s.id === id ? { ...s, ...seller } : s
      )
    );
  };

  const deleteSeller = (id: string) => {
    setSellers(sellers.filter((s) => s.id !== id));
  };

  return (
    <SellerContext.Provider value={{ sellers, addSeller, updateSeller, deleteSeller }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSellers() {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error("useSellers must be used within SellerProvider");
  }
  return context;
}
