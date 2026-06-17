import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkles, Zap, Shield, ShoppingCart, Star, Trophy } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { CartNotification } from "@/components/cart/CartNotification";
import { motion } from "framer-motion";

export function ProductsPreview() {
  const { products, categories, loading } = useProducts();
  const { addToCart } = useCart();
  const [addedProduct, setAddedProduct] = useState<{ id: string, name: string } | null>(null);

  const mainProducts = products
    .filter(p => {
      const name = p.name.toLowerCase();
      const cat = p.category?.toLowerCase() || "";
      return name.includes("kit") || cat === "completo" || cat === "simples" || cat.includes("van") || ["mercedes-sprinter", "fiat-ducato", "vw-kombi", "renault-master"].includes(cat);
    })
    .slice(0, 4);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-white">
      {/* Background Decor - Subtle & Modern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(34,197,94,0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 border border-green-200 px-6 py-2 rounded-full mb-6"
          >
            <Trophy className="w-4 h-4 text-green-600" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Convocação Oficial 2026</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-none tracking-tight uppercase mb-6">
            NOSSA <span className="text-green-600">ESCALAÇÃO</span>
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            A tecnologia líder que entra em campo para revolucionar sua van com conforto e segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-50 rounded-[2rem] h-[450px] animate-pulse border border-slate-100" />
            ))
          ) : mainProducts.length > 0 ? (
            mainProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:border-green-200 transition-all duration-500 flex flex-col"
              >
                {/* Image area */}
                <div className="relative h-60 flex items-center justify-center bg-slate-50 overflow-hidden">
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider">
                      CONVOCADO
                    </span>
                    <span className="bg-white text-slate-900 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-100 shadow-sm">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> PADRÃO FIFA
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
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-green-600 transition-colors uppercase leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest">
                      {categories.find(c => c.key === product.category)?.name || product.category?.replace(/-/g, ' ')}
                    </p>
                  </div>

                  <div className="mt-auto space-y-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Investimento Premium</span>
                      <span className="text-3xl font-bold text-slate-900">
                        {formatCurrency(product.price)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Button 
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
                        className="w-full bg-slate-900 hover:bg-black text-white font-bold py-6 rounded-xl transition-all shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        COMPRAR AGORA
                      </Button>
                      <Link to={`/produto/${product.id}`} className="block">
                        <Button variant="ghost" className="w-full text-slate-500 hover:text-green-600 hover:bg-green-50 font-bold text-[10px] uppercase tracking-widest">
                          Detalhes Táticos
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : null}
        </div>

        <div className="mt-20 text-center">
          <Link to="/produtos">
            <Button variant="outline" className="border-slate-200 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-2xl px-10 py-7 font-bold text-base transition-all group">
              VER TODA ESCALAÇÃO
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <CartNotification 
        productName={addedProduct?.name || ""} 
        isOpen={!!addedProduct} 
        onClose={() => setAddedProduct(null)} 
      />
    </section>
  );
}
