import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Wrench, ArrowRight } from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { formatCurrency } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { CartNotification } from "@/components/cart/CartNotification";
import { motion } from "framer-motion";

const partIcons = [Package, Wrench, ShoppingCart, Package];

export function ReplacementParts() {
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [addedProduct, setAddedProduct] = useState<{ id: string, name: string } | null>(null);

  const parts = products.filter(p => p.category === "pecas").slice(0, 8);
  const hasParts = !loading && parts.length > 0;

  return (
    <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-3"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">Peças & Consumíveis</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight"
            >
              Peças de Reposição
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 mt-2 max-w-lg font-medium"
            >
              Componentes originais com garantia para manter seu sistema sempre funcionando.
            </motion.p>
          </div>
          <Link to="/produtos?categoria=pecas" className="flex-shrink-0">
            <Button variant="outline" className="gap-2 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold">
              Ver Todas as Peças <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-44 animate-pulse" />
            ))}
          </div>
        ) : hasParts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parts.map((part, index) => {
              const Icon = partIcons[index % partIcons.length];
              return (
                <motion.div
                  key={part.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300 flex flex-col gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  {part.image && (
                    <img
                      src={part.image}
                      alt={part.name}
                      className="w-full h-24 object-contain rounded-lg"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-sm font-black text-slate-900 leading-tight">{part.name}</h3>
                    {part.description && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{part.description}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{formatCurrency(part.price)}</p>
                    <button
                      onClick={() => {
                        addToCart({
                          id: part.id,
                          name: part.name,
                          price: part.price,
                          image: part.image,
                          quantity: 1,
                          category: part.category || "",
                        });
                        setAddedProduct({ id: part.id, name: part.name });
                      }}
                      className="mt-2 w-full py-2 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition-all"
                    >
                      Adicionar
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Static components when no DB parts */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Motor Automático 80W", desc: "Alta potência e durabilidade", price: null, badge: "Essencial" },
              { name: "Cremalheira de Aço", desc: "Reforçada para máxima resistência", price: null, badge: null },
              { name: "Botão do Painel", desc: "Controle integrado ao painel", price: null, badge: null },
              { name: "Controle Remoto", desc: "Wireless de longo alcance", price: null, badge: "Popular" },
            ].map((item, index) => {
              const Icon = partIcons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  {item.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 mb-2">
                      {item.badge}
                    </span>
                  )}
                  <h3 className="text-sm font-black text-slate-900 leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                  <button className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all">
                    Consultar
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Featured Kit Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
            boxShadow: "0 20px 60px rgba(29,78,216,0.2)"
          }}
        >
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-blue-300 border border-blue-500/30 mb-5"
                style={{ background: "rgba(59,130,246,0.1)" }}>
                ⚡ Kit Completo
              </span>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                Kit Completo de Reposição
              </h3>
              <p className="text-blue-200 leading-relaxed mb-6 font-medium text-sm">
                Pacote com todos os componentes mais solicitados. Perfeito para manutenção preventiva ou reparos de urgência.
              </p>
              <ul className="space-y-2 mb-7">
                {["Motor + Cremalheira + Botão + Controle", "Frete grátis acima de R$ 1.000", "Garantia de 12 meses em tudo"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-blue-100 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                  Solicitar Orçamento
                </button>
              </a>
            </div>
            <div className="hidden md:flex items-center justify-center p-8">
              <div className="w-64 h-64 relative">
                <div className="absolute inset-0 rounded-3xl opacity-30"
                  style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", filter: "blur(20px)" }} />
                <img
                  src="/ftproduto.jpeg"
                  alt="Kit Completo"
                  className="relative z-10 w-full h-full object-contain rounded-2xl"
                  style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.5))" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <CartNotification
        productName={addedProduct?.name || ""}
        isOpen={!!addedProduct}
        onClose={() => setAddedProduct(null)}
      />
    </section>
  );
}
