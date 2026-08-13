import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
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
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(219,234,254,0.8) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(219,234,254,0.6) 0%, transparent 70%)" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2 rounded-full mb-5"
          >
            <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest">Produtos em Destaque</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight"
          >
            Conforto e Segurança{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              Para Sua Van
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-4 text-lg font-medium"
          >
            A tecnologia líder em automação de portas para vans escolares e de transporte.
          </motion.p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-slate-100 rounded-3xl h-[440px] animate-pulse" />
            ))
          ) : mainProducts.length > 0 ? (
            mainProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-400 flex flex-col"
              >
                {/* Image area */}
                <Link
                  to={`/produto/${product.id}`}
                  className="relative h-56 flex items-center justify-center bg-slate-50 overflow-hidden border-b border-slate-100"
                >
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-20">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow">
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <img
                    src={product.image || (product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg")}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg";
                    }}
                  />
                </Link>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4 flex-1">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                      {categories.find(c => c.key === product.category)?.name || product.category?.replace(/-/g, ' ')}
                    </p>
                    <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {(product.originalPrice || 0) > product.price && (
                      <span className="text-slate-400 line-through text-xs font-semibold block mb-0.5">
                        De {formatCurrency(product.originalPrice || 0)}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      {(product.originalPrice || 0) > product.price && (
                        <span className="text-xs font-bold text-slate-500">Por</span>
                      )}
                      <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <p className="text-blue-500 text-[11px] font-semibold mt-1">10x sem juros</p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 mt-auto">
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
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Comprar Agora
                    </Button>
                    <Link to={`/produto/${product.id}`} className="block">
                      <Button variant="ghost" className="w-full h-10 text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-semibold text-sm rounded-xl transition-all">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : null}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link to="/produtos">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-10 py-6 font-bold text-base transition-all group gap-3">
              Ver Todos os Produtos
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
