import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductContext";
import { ArrowLeft, Check, Shield, Truck, MessageCircle, Phone, Sparkles, Star, Zap, Award, Users, Video, Music, PlayCircle, Trophy, ShoppingCart, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { CartNotification } from "@/components/cart/CartNotification";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  
  const product = id ? products.find(p => 
    p.id === id || 
    p.id === String(id) ||
    p.name?.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()
  ) : null;
  
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [addedProduct, setAddedProduct] = useState<{ id: string, name: string } | null>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const scrollToVideo = () => {
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        category: product.category || "",
      });
      setAddedProduct({ id: product.id, name: product.name });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-lg text-slate-600">Carregando informações...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
          <Link to="/produtos">
            <Button variant="default" className="bg-green-600 hover:bg-green-500">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Produtos
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <Layout>
      {/* Product Details Section */}
      <section className="pt-44 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                    Convocado Oficial
                  </span>
                  <span className="bg-white text-slate-900 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-slate-200 shadow-sm">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Padrão FIFA
                  </span>
                </div>
                
                <div className="aspect-square flex items-center justify-center p-8">
                   <img 
                    src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                        selectedImage === idx ? "border-green-600 shadow-md" : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info Section - SOFTER VERSION */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                  <Trophy className="w-4 h-4" /> 
                  Tecnologia de Elite
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Price & Buying Section - LESS AGGRESSIVE */}
              <div className="bg-slate-50/50 rounded-3xl p-8 border border-slate-100 space-y-8">
                <div className="flex flex-col gap-1">
                  <span className="text-green-600 font-bold text-[10px] uppercase tracking-widest">Investimento Premium</span>
                  <span className="text-4xl md:text-5xl font-bold text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-green-600 font-bold text-[10px] uppercase mb-1">Condição Especial</p>
                    <p className="text-slate-900 font-bold text-lg">10x Sem Juros</p>
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">No Cartão</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-5 shadow-sm">
                    <p className="text-green-700 font-bold text-[10px] uppercase mb-1">Envio Imediato</p>
                    <p className="text-green-800 font-bold text-lg flex items-center gap-2">
                      <Truck className="w-5 h-5" /> Brasil Todo
                    </p>
                    <p className="text-green-600 text-[10px] font-medium uppercase tracking-wider">Em até 24h</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-2 h-14 px-5 shadow-sm">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-bold text-slate-400 hover:text-green-600 transition-colors">−</button>
                      <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-bold text-slate-400 hover:text-green-600 transition-colors">+</button>
                    </div>
                    <Button 
                      onClick={handleAddToCart}
                      className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-7 rounded-xl text-base uppercase tracking-wider transition-all shadow-lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-3" />
                      Comprar Agora
                    </Button>
                  </div>
                  
                  <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-7 rounded-xl text-base uppercase tracking-wider transition-all shadow-lg">
                      <MessageCircle className="w-5 h-5 mr-3 fill-white" />
                      Falar com Consultor
                    </Button>
                  </a>
                </div>
              </div>

              {/* Specs Softened */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-1 h-6 bg-green-600 rounded-full" />
                  Recursos do Sistema
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(product.features || ["Kit completo de automação", "Sensor antiesmagamento", "Controle remoto", "Manual de instalação"]).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparative Table Softened */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Comparação Técnica</h2>
            <p className="text-slate-500 font-semibold text-sm uppercase tracking-widest">A tecnologia ideal para cada necessidade</p>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 shadow-xl bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-widest">Características</th>
                  <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest">ABNT</th>
                  <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest">C/ Sensor</th>
                  <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-widest">S/ Sensor</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 text-sm">
                {[
                  "Acionador", "Fixação Cremalheira", "Central de Comando", "Sensor Antiesmagamento", 
                  "Botão no Painel", "Sinal Sonoro"
                ].map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-6 py-4 font-semibold text-slate-900">{f}</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <CartNotification 
        productName={addedProduct?.name || ""} 
        isOpen={!!addedProduct} 
        onClose={() => setAddedProduct(null)} 
      />
    </Layout>
  );
};

export default ProductDetail;
