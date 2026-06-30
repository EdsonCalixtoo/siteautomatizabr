import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { CartNotification } from "@/components/cart/CartNotification";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductContext";
import { CATEGORY_LOGOS } from "@/data/brandLogos";
import { Package, Zap, ShoppingCart, ChevronDown, Filter, X, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

const Products = () => {
  const [searchParams] = useSearchParams();
  const vehicleParam = searchParams.get("vehicle");
  const searchParam = searchParams.get("search");
  const { products, categories, subcategories } = useProducts();
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

  // Categorias dinâmicas
  const vehicleCategories = categories.filter(c => subcategories.some(s => s.categoryId === c.id)).sort((a, b) => a.name.localeCompare(b.name));
  const otherCategoriesDynamic = categories.filter(c => !subcategories.some(s => s.categoryId === c.id));

  const filteredProducts = products.filter(p => {
    // If a search parameter exists, enforce it
    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      const matchesName = p.name.toLowerCase().includes(searchLower);
      const matchesSubcat = p.subcategory?.toLowerCase().includes(searchLower);
      const matchesCat = p.category?.toLowerCase().includes(searchLower);
      
      if (!matchesName && !matchesSubcat && !matchesCat) {
        return false;
      }
    }

    if (selectedCategory === "all") return true;
    
    // Se a categoria selecionada for um veículo (dinâmica)
    const isVehicleCategory = vehicleCategories.some(c => c.key === selectedCategory);
    if (isVehicleCategory) {
      const catData = categories.find(c => c.key === selectedCategory);
      const matchesCategory = p.category === selectedCategory || 
                             p.category === catData?.name ||
                             (p.category === "Portas Automáticas" && p.subcategory === catData?.name);
      
      if (!matchesCategory) return false;
      if (selectedSubcategory === "all") return true;
      return p.subcategory === selectedSubcategory;
    }
    
    // Categorias fixas (Kits, etc) baseadas no DB
    const catDataOther = categories.find(c => c.key === selectedCategory);
    return p.category === selectedCategory || p.category === catDataOther?.name;
  }).sort((a, b) => {
    // Ordenar para garantir que "Sem Sensor" venha antes de "Com Sensor"
    // Como "Sem Sensor" é mais barato, ordenar por preço crescente já resolve perfeitamente
    // e também é uma ótima prática de e-commerce!
    return a.price - b.price;
  });

  return (
    <Layout>
      {/* Header */}
      <section className="pt-40 pb-20 bg-[#071936] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-[#071936] to-yellow-900/20" />
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-yellow-500/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold uppercase tracking-[0.3em] text-xs">Volta às Aulas</span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">
              ESPECIAL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">FÉRIAS</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-2xl mx-auto italic">
              "A tecnologia de ponta para garantir o conforto e a segurança no transporte escolar."
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
              className="w-full bg-white border-2 border-green-100 p-4 rounded-2xl flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-600" />
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
                  <Filter className="w-5 h-5 text-green-600" />
                  <h2 className="font-heading text-lg font-bold text-gray-900">Filtros</h2>
                </div>

                {/* Other Categories */}
                <div className="mb-8 pb-8 border-b-2 border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Kits & Acessórios</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedSubcategory("all");
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                        selectedCategory === "all"
                          ? "bg-green-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      📦 Todos os Produtos
                    </button>
                    {otherCategoriesDynamic.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.key);
                          setSelectedSubcategory("all");
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                          selectedCategory === cat.key && selectedSubcategory === "all"
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {cat.name.includes("Kit") ? "🏆" : "🔧"} {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Door Categories */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">PORTAS AUTOMÁTICAS</h3>
                  <div className="space-y-1">
                    {vehicleCategories.map((catData) => (
                      <div key={catData.key}>
                        <button
                          onClick={() => {
                            setExpandedCategory(expandedCategory === catData.key ? null : catData.key);
                            setSelectedCategory(catData.key);
                            setSelectedSubcategory("all");
                          }}
                          className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 font-medium flex items-center justify-between gap-3 ${
                            selectedCategory === catData.key && selectedSubcategory === "all"
                              ? "bg-green-100 text-green-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {CATEGORY_LOGOS[catData.key] ? (
                              <img 
                                src={CATEGORY_LOGOS[catData.key]} 
                                alt={catData.name}
                                className="h-6 w-6 object-contain"
                              />
                            ) : (
                              <span>🚐</span>
                            )}
                            <span>{catData.name}</span>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform flex-shrink-0 ${
                              expandedCategory === catData.key ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        
                        {expandedCategory === catData.key && (
                          <div className="ml-4 mt-2 space-y-1 border-l-2 border-cyan-200 pl-0">
                            {subcategories.filter(s => s.categoryId === catData.id).map((subcat) => (
                              <button
                                key={subcat.id}
                                onClick={() => {
                                  setSelectedCategory(catData.key);
                                  setSelectedSubcategory(subcat.name);
                                  setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                                  selectedSubcategory === subcat.name
                                    ? "bg-green-600 text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                {subcat.name}
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
                      className="w-full bg-green-600 py-6 rounded-2xl font-bold"
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
                    Mostrando <span className="font-bold text-green-600">{filteredProducts.length}</span> produtos
                  </p>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group relative bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 transform hover:-translate-y-2 flex flex-col">
                    {/* Image Area */}
                    <Link to={`/produto/${product.id}`} className="relative h-60 overflow-hidden bg-gray-50 flex items-center justify-center border-b border-gray-100">
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg">
                          {product.badge || 'Destaque'}
                        </span>
                        <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-blue-950 px-3 py-1 rounded-lg text-center text-[9px] font-black uppercase tracking-tighter shadow-lg flex items-center gap-1 border border-yellow-400/50">
                          <Star className="w-3 h-3 fill-blue-950" /> FÉRIAS ESCOLAR
                        </span>
                      </div>
                      <img 
                        src={product.image || (product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg")}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg";
                        }}
                      />
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                        <Link to={`/produto/${product.id}`}>
                          <h3 className="font-heading text-lg font-bold text-gray-900 line-clamp-2 hover:text-green-600 transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                          {categories.find(c => c.key === product.category)?.name || product.category?.replace(/-/g, ' ')}
                        </p>
                      </div>

                      {/* Price */}
                      {(() => {
                        let displayPrice = product.price;
                        let originalPrice = product.originalPrice;
                        const nameLower = product.name.toLowerCase();
                        if (nameLower.includes("sem sensor")) {
                          originalPrice = 1680;
                          displayPrice = 1430;
                        } else if (nameLower.includes("com sensor")) {
                          originalPrice = 1880;
                          displayPrice = 1750;
                        }
                        
                        return (
                          <div className="mb-6">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest mb-0.5 animate-pulse">🎒 Oferta de Férias</span>
                              {((originalPrice || 0) > displayPrice) && (
                                <span className="text-gray-400 line-through text-xs font-medium mb-0.5">
                                  De: {formatCurrency(originalPrice || 0)}
                                </span>
                              )}
                              <div className="flex items-baseline gap-2">
                                {((originalPrice || 0) > displayPrice) && (
                                  <span className="text-sm font-bold text-gray-500">Por:</span>
                                )}
                                <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                                  {formatCurrency(displayPrice)}
                                </span>
                              </div>
                            </div>
                            {((originalPrice || 0) > displayPrice) && (
                              <span className="text-[10px] text-blue-600 font-bold mt-1 block">
                                ECONOMIZE {formatCurrency((originalPrice || 0) - displayPrice)}
                              </span>
                            )}
                          </div>
                        );
                      })()}

                      {/* Buttons */}
                      <div className="mt-auto space-y-2">
                        <button
                          onClick={() => {
                            let finalPrice = product.price;
                            if (product.name.toLowerCase().includes("sem sensor")) finalPrice = 1430;
                            else if (product.name.toLowerCase().includes("com sensor")) finalPrice = 1750;
                            
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: finalPrice,
                              image: product.image,
                              quantity: 1,
                              category: product.category || "",
                            });
                            setAddedProduct({ id: product.id, name: product.name });
                          }}
                          className={`w-full h-12 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md ${
                            addedToCart[product.id]
                              ? "bg-blue-600 text-white"
                              : "bg-slate-900 text-white hover:bg-blue-600"
                          }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {addedToCart[product.id] ? "ADICIONADO" : "COMPRAR AGORA"}
                        </button>
                        <Link to={`/produto/${product.id}`} className="block">
                          <button className="w-full h-11 border-2 border-slate-100 text-slate-500 hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-xs transition-all duration-300 uppercase tracking-widest">
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
