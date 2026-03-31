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

export const sellers: Seller[] = [
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

/**
 * Encontra o vendedor responsável por uma categoria
 * Busca usando comparação case-insensitive e tolerância para variações
 * Também mapeia nomes de produtos conhecidos
 */
export const getSellerForCategory = (category: string): Seller | undefined => {
  if (!category || category.trim() === "") return undefined;

  const normalizedCategory = category.toLowerCase().trim();

  // Mapeamento direto por nome de produto (fácil identificação)
  const productNameMap: { [key: string]: string } = {
    "kit completo": "Kits Completos",
    "cremalheira": "Cremalheira",
    "ímã": "Peças Individuais",
    "peça": "Peças Individuais",
    "motor": "Peças Individuais",
    "sensor": "Peças Individuais",
    "acessório": "Acessórios",
    "manutenção": "Manutenção",
  };

  // Procura por correspondência na categoria nativa primeiro
  for (const word in productNameMap) {
    if (normalizedCategory.includes(word)) {
      category = productNameMap[word];
      break;
    }
  }

  // Busca exata
  const exactMatch = sellers.find((seller) =>
    seller.categories.some(
      (cat) => cat.toLowerCase() === category.toLowerCase()
    )
  );

  if (exactMatch) return exactMatch;

  // Se não encontrou, tenta busca parcial (contains)
  const partialMatch = sellers.find((seller) =>
    seller.categories.some((cat) => {
      const normalizedCat = cat.toLowerCase();
      return (
        normalizedCategory.includes(normalizedCat) ||
        normalizedCat.includes(normalizedCategory)
      );
    })
  );

  return partialMatch;
};
