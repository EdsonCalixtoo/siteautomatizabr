import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, ShoppingCart, Star } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { CartNotification } from "@/components/cart/CartNotification";

export function ProductsPreview() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [addedProduct, setAddedProduct] = useState<{ id: string, name: string } | null>(null);

  // Filtro inteligente para Kits de Destaque
  // Inclui categorias 'completo', 'simples' e qualquer van específica, filtrando pelo nome "Kit" no produto
  const mainProducts = products
    .filter(p => {
      const name = p.name.toLowerCase();
      const cat = p.category?.toLowerCase() || "";
      return name.includes("kit") || cat === "completo" || cat === "simples" || cat.includes("van") || ["mercedes-sprinter", "fiat-ducato", "vw-kombi", "renault-master"].includes(cat);
    })
    .slice(0, 4);

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-cyan-50 border border-cyan-100 px-4 py-2 rounded-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest">Tecnologia Automotiva</span>
          </div>
          <h2 className="font-heading text-5xl font-black text-gray-900 leading-tight">
            Nossos <span className="text-cyan-600">Kits em Destaque</span>
          </h2>
          <p className="text-lg text-gray-600 mt-4 font-medium">
            Escolha a tecnologia certa para o seu dia a dia e automatize sua frota.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {loading ? (
            // Skeleton Loading
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-[500px] animate-pulse">
                <div className="h-60 bg-gray-100" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-100 rounded mt-8" />
                  <div className="h-12 bg-gray-200 rounded-2xl w-full mt-4" />
                </div>
              </div>
            ))
          ) : mainProducts.length > 0 ? (
            mainProducts.map((product, index) => (
              <div 
                key={product.id}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 transform hover:-translate-y-2 ${
                  index === 0 ? 'border-cyan-500/50 md:scale-105' : 'border-gray-100 hover:border-cyan-200'
                }`}
              >
                {/* Image area */}
                <div className="relative h-60 flex items-center justify-center overflow-hidden bg-gray-50 border-b border-gray-100">
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <span className="bg-cyan-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg">
                      {product.badge || 'Destaque'}
                    </span>
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-lg flex items-center gap-1 border border-amber-400/50">
                      <Star className="w-3 h-3 fill-amber-950" /> 10 ANOS
                    </span>
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 font-medium italic">
                      {product.category?.replace(/-/g, ' ').toUpperCase()}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-8">
                    {(product.originalPrice ?? 0) > 0 && (
                      <span className="text-gray-400 line-through text-sm font-medium">
                        {formatCurrency(product.originalPrice!)}
                      </span>
                    )}
                    <div className="flex flex-col">
                      <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest mb-1 animate-pulse">✨ Oferta de Aniversário</span>
                      <span className="font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-500">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
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
                      className="w-full bg-slate-950 hover:bg-cyan-600 text-white font-black py-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      COMPRAR AGORA
                    </button>
                    <Link to={`/produto/${product.id}`} className="w-full">
                      <button className="w-full border-2 border-slate-100 text-slate-500 hover:border-cyan-100 hover:text-cyan-600 hover:bg-cyan-50 font-bold py-3 rounded-2xl text-[10px] transition-all duration-300 uppercase tracking-widest">
                        Mais detalhes
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Caso não tenha kits, mostra qualquer produto
            products.slice(0, 4).map((product, index) => (
              <div 
                key={product.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 hover:border-cyan-200 transition-all transform hover:-translate-y-2"
              >
                  {/* ... conteúdo simplificado se necessário, ou repete o de cima ... */}
                  {/* Vou usar o mesmo layout mas com fallback */}
                  <div className="relative h-60 flex items-center justify-center overflow-hidden bg-gray-50 border-b border-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-cyan-600 font-black text-2xl mt-2">{formatCurrency(product.price)}</p>
                  <Link to={`/produto/${product.id}`} className="block mt-4 text-cyan-600 font-bold text-sm underline">Ver Produto</Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-16">
          <Link to="/produtos">
            <Button className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold py-6 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 group">
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <CartNotification 
        isOpen={!!addedProduct}
        productName={addedProduct?.name}
        onClose={() => setAddedProduct(null)}
      />
    </section>
  );
}
