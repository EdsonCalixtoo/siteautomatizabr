import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CartNotification } from "@/components/cart/CartNotification";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductContext";
import { CATEGORY_LOGOS } from "@/data/brandLogos";
import { Package, Zap, ShoppingCart, ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

const Products = () => {
  const [searchParams] = useSearchParams();
  const vehicleParam = searchParams.get("vehicle");
  const { products } = useProducts();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedToCart, setAddedToCart] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    if (vehicleParam) {
      setSelectedCategory(vehicleParam);
      setExpandedCategory(vehicleParam);
    }
  }, [vehicleParam]);

  // Define categories and subcategories structure
  const categoryStructure: Record<string, { label: string; icon: string; subcategories: string[] }> = {
    "citroen-jumper": { 
      label: "Citroen - Jumper", 
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor", "ABNT"]
    },
    "citroen-jumpy": {
      label: "Citroen - Jumpy",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "fiat-ducato": {
      label: "Fiat - Ducato",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor", "ABNT"]
    },
    "fiat-scudo": {
      label: "Fiat Scudo",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "ford-transit": {
      label: "Ford - Transit",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "iveco-daily": {
      label: "Iveco - Daily",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor", "ABNT"]
    },
    "kia-besta": {
      label: "Kia - Besta",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor", "ABNT"]
    },
    "mercedes-sprinter": {
      label: "Mercedes - Sprinter",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "peugeot-boxer": {
      label: "Peugeot - Boxer",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "peugeot-expert": {
      label: "Peugeot Expert",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "renault-master": {
      label: "Renault - Master",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor"]
    },
    "vw-kombi": {
      label: "Volkswagen - Kombi",
      icon: "🚐",
      subcategories: ["Com Sensor", "Sem Sensor", "ABNT"]
    },
  };

  const otherCategories = [
    { id: "completo", label: "Kit Completo", icon: "🏆" },
    { id: "simples", label: "Kit Simples", icon: "⚡" },
    { id: "consumivel", label: "Consumíveis & Peças", icon: "🔧" },
  ];

  const filteredProducts = products.filter(p => {
    if (selectedCategory === "all") return true;
    
    // Se a categoria selecionada for um veículo (do categoryStructure)
    if (categoryStructure[selectedCategory]) {
      const catData = categoryStructure[selectedCategory];
      const matchesCategory = p.category === selectedCategory || 
                             p.category === catData.label ||
                             (p.category === "Portas Automáticas" && p.subcategory === catData.label);
      
      if (!matchesCategory) return false;
      if (selectedSubcategory === "all") return true;
      return p.subcategory === selectedSubcategory;
    }
    
    // Categorias fixas (Kits, etc)
    return p.category === selectedCategory;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3 text-white/80">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">Catálogo Completo</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white">
              Nossos Produtos
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Conheça nossa linha completa de kits de automação e componentes de qualidade premium
            </p>
          </div>
        </div>
      </section>

      {/* Products Section with Sidebar */}
      <section className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6 sticky top-[90px] z-30">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="w-full bg-white border-2 border-cyan-100 p-4 rounded-2xl flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-cyan-600" />
                <span className="font-bold text-gray-900">Filtrar por Veículo</span>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className={cn(
              "lg:col-span-1 lg:block",
              isFilterOpen ? "fixed inset-0 z-[100] bg-white p-8 overflow-y-auto block" : "hidden"
            )}>
              {isFilterOpen && (
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden absolute top-8 right-8 p-3 rounded-2xl bg-gray-100 text-gray-900"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
              <div className="bg-white rounded-2xl lg:border-2 lg:border-gray-100 lg:p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-cyan-600" />
                  <h2 className="font-heading text-lg font-bold text-gray-900">Filtros</h2>
                </div>

                {/* Other Categories */}
                <div className="mb-8 pb-8 border-b-2 border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Produtos</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubcategory("all");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                        selectedCategory === "all"
                          ? "bg-cyan-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      📦 Todos os Produtos
                    </button>
                    {otherCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSelectedSubcategory("all");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                          selectedCategory === cat.id && selectedSubcategory === "all"
                            ? "bg-cyan-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Door Categories */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Portas Automáticas</h3>
                  <div className="space-y-1">
                    {Object.entries(categoryStructure).map(([key, catData]) => (
                      <div key={key}>
                        <button
                          onClick={() => {
                            setExpandedCategory(expandedCategory === key ? null : key);
                            setSelectedCategory(key);
                            setSelectedSubcategory("all");
                          }}
                          className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 font-medium flex items-center justify-between gap-3 ${
                            selectedCategory === key && selectedSubcategory === "all"
                              ? "bg-cyan-100 text-cyan-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {CATEGORY_LOGOS[key] ? (
                              <img 
                                src={CATEGORY_LOGOS[key]} 
                                alt={catData.label}
                                className="h-6 w-6 object-contain"
                              />
                            ) : (
                              <span>{catData.icon}</span>
                            )}
                            <span>{catData.label}</span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform flex-shrink-0 ${
                              expandedCategory === key ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        {expandedCategory === key && (
                          <div className="ml-4 mt-2 space-y-1 border-l-2 border-cyan-200 pl-0">
                            {catData.subcategories.map((subcat) => (
                              <button
                                key={subcat}
                                onClick={() => {
                                  setSelectedCategory(key);
                                  setSelectedSubcategory(subcat);
                                  setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                                  selectedSubcategory === subcat
                                    ? "bg-cyan-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {subcat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {isFilterOpen && (
                  <div className="mt-12 lg:hidden">
                    <Button 
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full bg-cyan-600 py-6 rounded-2xl font-bold"
                    >
                      Ver Resultados
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Products Grid */}
            <div className="lg:col-span-3">
              {/* Products Count */}
              <div className="mb-12 flex items-center justify-between">
                <div>
                  <p className="text-gray-600">
                    Mostrando <span className="font-bold text-cyan-600">{filteredProducts.length}</span> produtos
                  </p>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 flex flex-col">
                    {/* Image Area */}
                    <Link to={`/produto/${product.id}`} className="relative h-60 overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
                      {product.badge && (
                        <div className="absolute top-4 left-4 z-20">
                          <span className="bg-cyan-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg">
                            {product.badge}
                          </span>
                        </div>
                      )}
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <Link to={`/produto/${product.id}`}>
                          <h3 className="font-heading text-lg font-bold text-gray-900 line-clamp-2 hover:text-cyan-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                          {product.category}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                          {(product.originalPrice ?? 0) > 0 && (
                            <span className="text-gray-400 line-through text-xs">
                              {formatCurrency(product.originalPrice!)}
                            </span>
                          )}
                           <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-400">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                        {(product.originalPrice ?? 0) > 0 && (
                          <span className="text-[10px] text-green-600 font-bold mt-1">
                            ECONOMIZE {formatCurrency(product.originalPrice! - product.price)}
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="mt-auto space-y-2">
                        <button
                          onClick={() => {
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              image: product.image,
                              quantity: 1,
                              category: product.category || "",
                            });
                            setAddedProduct({ id: product.id, name: product.name });
                          }}
                          className={`w-full h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md ${
                            addedToCart[product.id]
                              ? "bg-green-600 text-white"
                              : "bg-slate-900 text-white hover:bg-cyan-600"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {addedToCart[product.id] ? "ADICIONADO" : "COMPRAR AGORA"}
                        </button>
                        <Link to={`/produto/${product.id}`} className="block">
                          <button className="w-full h-11 border-2 border-slate-100 text-slate-500 hover:border-cyan-100 hover:text-cyan-600 hover:bg-cyan-50 font-bold rounded-xl text-xs transition-all duration-300 uppercase tracking-widest">
                            Ver detalhes
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg font-medium">Nenhum produto encontrado nesta categoria</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CartNotification 
        isOpen={!!addedProduct}
        productName={addedProduct?.name}
        onClose={() => setAddedProduct(null)}
      />
    </Layout>
  );
};

export default Products;
