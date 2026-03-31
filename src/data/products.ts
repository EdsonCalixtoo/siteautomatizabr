export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  stock: number;
  createdAt: string;
  sku?: string;
  weight?: string;
  dimensions?: string;
  warranty?: string;
  material?: string;
  status?: string;
  features?: string[];
  badge?: string;
  shortDescription?: string;
  videoUrl?: string;
  audioUrl?: string;
}

const PRODUCT_IMAGE = "/ftproduto.jpeg";
const PRODUCT_VIDEO = "/video-demonstrativo.mp4";

const getCommonItemsN = () => [
  "Chicote elétrico",
  "Suporte da coluna",
  "Courinho com capinha",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Fusível",
  "Trava em U",
  "Parafuso Allen",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 60mm",
  "Espaçador 60mm",
  "Adesivo",
  "Adesivo",
  "Garantia",
  "Colar azul",
  "Cremalheira 1,20m"
];

const getCommonItemsDucato = () => [
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Espaçador 40mm",
  "Porta fusível",
  "Parafuso Allen",
  "Trava cabo",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Courinho com capinha",
  "Suporte da coluna",
  "Adesivo",
  "Adesivo",
  "Adesivo",
  "Garantia",
  "Cremalheira 1,10m",
  "Chicote"
];

const getCommonItemsMasterA = () => [
  "Chicote",
  "Suporte da coluna",
  "Courinho com capinha",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Fusível",
  "Parafuso Allen",
  "Trava cabo",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Adesivo",
  "Adesivo",
  "Garantia",
  "Colar azul",
  "Cremalheira 1,00m"
];

const getCommonItemsSprinterA = () => [
  "Chicote",
  "Suporte da coluna",
  "Courinho com capinha",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Abraçadeira plástica",
  "Fusível",
  "Parafuso Allen",
  "Trava cabo",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Espaçador pequeno",
  "Adesivo",
  "Adesivo",
  "Garantia",
  "Colar azul",
  "Cremalheira 0,90m"
];

const createKitPair = (baseId: string, vehicleName: string, itemsFetcher: () => string[], description: string) => {
  const kits: Product[] = [];
  const items = itemsFetcher();
  
  // Versão Com Sensor
  kits.push({
    id: `${baseId}-com-sensor`,
    name: `KIT ${vehicleName} - COM SENSOR`,
    shortDescription: `Sistema completo de automação para porta ${vehicleName} com sensor.`,
    description: description,
    price: 2499.00,
    image: PRODUCT_IMAGE,
    images: [PRODUCT_IMAGE],
    features: [...items, "Sensor Anti-Esmagamento"],
    stock: 10,
    category: "completo",
    subcategory: "Com Sensor",
    warranty: "12 meses",
    createdAt: new Date().toISOString(),
    status: "ativo",
    videoUrl: PRODUCT_VIDEO,
  });

  // Versão Sem Sensor
  kits.push({
    id: `${baseId}-sem-sensor`,
    name: `KIT ${vehicleName} - SEM SENSOR`,
    shortDescription: `Sistema completo de automação para porta ${vehicleName}.`,
    description: description,
    price: 2499.00,
    image: PRODUCT_IMAGE,
    images: [PRODUCT_IMAGE],
    features: items,
    stock: 10,
    category: "completo",
    subcategory: "Sem Sensor",
    warranty: "12 meses",
    createdAt: new Date().toISOString(),
    status: "ativo",
    videoUrl: PRODUCT_VIDEO,
  });

  return kits;
};

export const products: Product[] = [
  ...createKitPair("sprinter-n", "SPRINTER .N", getCommonItemsN, "Sistema completo para automação de porta lateral de vans Mercedes Sprinter nova. Proporciona abertura e fechamento automático da porta, trazendo mais conforto, segurança e praticidade no dia a dia. Ideal para transporte executivo, escolar e comercial."),
  ...createKitPair("daily-n", "DAILY .N", getCommonItemsN, "Kit completo para automação de porta lateral da Iveco Daily nova, garantindo praticidade e segurança no uso diário."),
  ...createKitPair("ducato", "DUCATO", getCommonItemsDucato, "Sistema de automação para porta lateral da Fiat Ducato, proporcionando abertura automática com segurança e conforto."),
  ...createKitPair("boxer", "BOXER", getCommonItemsDucato, "Sistema de automação para porta lateral da Peugeot Boxer, proporcionando abertura automática com segurança e conforto."),
  ...createKitPair("jumper", "JUMPER", getCommonItemsDucato, "Sistema de automação para porta lateral da Citroen Jumper, proporcionando abertura automática com segurança e conforto."),
  ...createKitPair("kombi", "KOMBI", getCommonItemsDucato, "Sistema de automação para porta lateral da VW Kombi, proporcionando abertura automática com segurança e conforto."),
  ...createKitPair("master-n", "MASTER .N", getCommonItemsN, "Sistema de automação para porta lateral da Renault Master nova, trazendo praticidade e segurança."),
  ...createKitPair("master-a", "MASTER .A", getCommonItemsMasterA, "Kit de automação para porta lateral da Renault Master antiga."),
  ...createKitPair("sprinter-a", "SPRINTER .A", getCommonItemsSprinterA, "Sistema de automação para porta lateral da Sprinter antiga."),
  
  // Acessórios e Consumíveis (Mantidos para variedade)
  {
    id: "motor-reposicao",
    name: "Motor de Reposição",
    description: "Motor de reposição original para kits já instalados. Compatível com todos os kits Automatiza.",
    price: 899.00,
    image: PRODUCT_IMAGE,
    category: "acessorio",
    subcategory: "Motores",
    stock: 15,
    createdAt: new Date().toISOString(),
    warranty: "6 meses",
    features: ["Motor original Automatiza", "Alta durabilidade", "Silencioso"]
  },
  {
    id: "controle-extra",
    name: "Controle Remoto Extra",
    description: "Controle remoto adicional compatível com todos os kits Automatiza.",
    price: 149.00,
    image: PRODUCT_IMAGE,
    category: "acessorio",
    subcategory: "Controle",
    stock: 50,
    createdAt: new Date().toISOString(),
    warranty: "3 meses",
    features: ["Alcance 30m", "Bateria inclusa"]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};
