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
    <section className="py-20 md:py-32 relative overflow-hidden bg-[#071936]">
      {/* Background Decor - Fun School Theme */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-[120px]" />
        
        {/* Floating School Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] text-4xl opacity-20"
        >🎒</motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -15, 15, 0] }} 
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-[15%] text-5xl opacity-20"
        >🚌</motion.div>
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 20, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-40 right-[20%] text-4xl opacity-20"
        >✏️</motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full"
          >
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-xs font-black text-yellow-400 uppercase tracking-[0.3em]">Volta às Aulas 2026</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase">
            ESPECIAL DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">FÉRIAS</span>
          </h2>
          <p className="text-xl text-blue-200 font-medium">
            A tecnologia líder para revolucionar sua van com conforto e segurança.
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
                className="group bg-white rounded-[2rem] overflow-hidden border-4 border-blue-900 shadow-[8px_8px_0_0_#1e3a8a] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#1e3a8a] transition-all duration-300 flex flex-col"
              >
                {/* Image area */}
                <Link to={`/produto/${product.id}`} className="relative h-60 flex items-center justify-center bg-blue-50 overflow-hidden block border-b-4 border-blue-900">
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    <span className="bg-yellow-400 text-blue-950 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 border-blue-950 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-2">
                      🎒 OFERTA DE FÉRIAS
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-2 border-blue-900 shadow-[2px_2px_0_0_#1e3a8a] transform translate-x-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> TOP ESCOLAR
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

                <div className="p-6 flex flex-col flex-1 bg-white">
                  <div className="mb-4">
                    <h3 className="text-xl font-black text-blue-950 uppercase leading-tight group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-widest">
                      {categories.find(c => c.key === product.category)?.name || product.category?.replace(/-/g, ' ')}
                    </p>
                  </div>

                  <div className="mt-auto space-y-6">
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
                        <div className="flex flex-col mb-4">
                          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1 bg-blue-50 w-fit px-2 py-0.5 rounded-md">Condição Especial</span>
                          {((originalPrice || 0) > displayPrice) && (
                            <span className="text-blue-900/40 line-through text-xs font-bold mb-0.5">
                              De: {formatCurrency(originalPrice || 0)}
                            </span>
                          )}
                          <div className="flex items-baseline gap-2">
                            {((originalPrice || 0) > displayPrice) && (
                              <span className="text-sm font-bold text-blue-900/60">Por:</span>
                            )}
                            <span className="text-4xl font-black text-blue-950 tracking-tighter">
                              {formatCurrency(displayPrice)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="space-y-2">
                      <Button 
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
                        className="w-full h-14 bg-blue-950 hover:bg-blue-900 text-white font-black uppercase tracking-wider rounded-xl transition-all shadow-[4px_4px_0_0_#1e3a8a] border-2 border-transparent active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5 text-yellow-400" />
                        COMPRAR AGORA
                      </Button>
                      <Link to={`/produto/${product.id}`} className="block">
                        <Button variant="ghost" className="w-full h-12 text-blue-900 hover:text-blue-600 hover:bg-blue-50 font-black text-[10px] uppercase tracking-widest border-2 border-transparent hover:border-blue-200">
                          Ver Detalhes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : null}
        </div>

        <div className="mt-20 text-center relative z-10">
          <Link to="/produtos">
            <Button className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 rounded-2xl px-12 py-8 font-black text-lg uppercase tracking-wider transition-all shadow-[8px_8px_0_0_#1e3a8a] border-4 border-blue-950 active:translate-y-1 active:shadow-[4px_4px_0_0_#1e3a8a] group">
              VER TODOS OS PRODUTOS
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
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
