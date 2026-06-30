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
import { Bandeirinhas } from "@/components/home/Bandeirinhas";

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
      let finalPrice = product.price;
      const nameLower = product.name.toLowerCase();
      if (nameLower.includes("sem sensor")) finalPrice = 1430;
      else if (nameLower.includes("com sensor")) finalPrice = 1750;

      addToCart({
        id: product.id,
        name: product.name,
        price: finalPrice,
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
            <Button variant="default" className="bg-blue-600 hover:bg-blue-500">
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
      <section className="pt-44 pb-20 bg-blue-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]" />
        <Bandeirinhas />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left: Image Gallery */}
            <div className="space-y-6">
              <div className="relative rounded-[2rem] overflow-hidden bg-white border-4 border-blue-900 shadow-[8px_8px_0_0_#1e3a8a] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0_0_#1e3a8a]">
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <span className="bg-yellow-400 text-blue-950 px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-blue-950 shadow-[4px_4px_0_0_#1e3a8a] transform -rotate-2">
                    🎒 OFERTA DE FÉRIAS
                  </span>
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border-2 border-blue-900 shadow-[2px_2px_0_0_#1e3a8a] transform translate-x-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> TOP ESCOLAR
                  </span>
                </div>
                
                <div className="aspect-square flex items-center justify-center p-8">
                   <img 
                    src={
                      (product.images && product.images.length > 0 && product.images[selectedImage]) 
                        ? product.images[selectedImage] 
                        : (product.image || (product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg"))
                    } 
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg";
                    }}
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
                        selectedImage === idx ? "border-blue-600 shadow-md" : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <img 
                        src={img || (product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg")}
                        alt={`Thumb ${idx}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = product.category === 'pecas' ? "https://placehold.co/600x600/f8fafc/94a3b8?text=Sem+Foto" : "/ftproduto.jpeg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info Section */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-blue-200">
                  <Trophy className="w-4 h-4 text-yellow-500" /> 
                  TECNOLOGIA DE PONTA
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight leading-tight uppercase">
                  {product.name}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Price & Buying Section - FUN SCHOOL THEME */}
              <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-[2rem] p-8 border-4 border-blue-950 shadow-[8px_8px_0_0_#1e3a8a] space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                <div className="flex flex-col gap-1 relative z-10">
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
                      <>
                        <span className="text-blue-950 font-black text-[11px] uppercase tracking-[0.2em] bg-white/50 w-fit px-3 py-1 rounded-md mb-2">
                          🚌 Especial Férias
                        </span>
                        {originalPrice && originalPrice > displayPrice && (
                          <span className="text-blue-900/60 line-through text-base font-bold mt-1">
                            De: {formatCurrency(originalPrice)}
                          </span>
                        )}
                        <div className="flex items-baseline gap-2">
                          {originalPrice && originalPrice > displayPrice && (
                            <span className="text-xl font-bold text-blue-950">Por:</span>
                          )}
                          <span className="text-5xl md:text-6xl font-black text-blue-950 tracking-tighter">
                            {formatCurrency(displayPrice)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div className="bg-white border-2 border-blue-950 rounded-2xl p-5 shadow-[4px_4px_0_0_#1e3a8a]">
                    <p className="text-blue-600 font-black text-[10px] uppercase mb-1">Pagamento</p>
                    <p className="text-blue-950 font-black text-xl">10x Sem Juros</p>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">No Cartão</p>
                  </div>
                  <div className="bg-blue-600 border-2 border-blue-950 rounded-2xl p-5 shadow-[4px_4px_0_0_#1e3a8a] text-white">
                    <p className="text-blue-200 font-black text-[10px] uppercase mb-1">Logística</p>
                    <p className="font-black text-xl flex items-center gap-2">
                      <Truck className="w-6 h-6 text-yellow-400" /> Envio Rápido
                    </p>
                    <p className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider">Para todo o Brasil</p>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 bg-white border-2 border-blue-950 rounded-xl p-2 h-16 px-6 shadow-[4px_4px_0_0_#1e3a8a]">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-black text-blue-950 hover:text-blue-600 transition-colors">−</button>
                      <span className="text-xl font-black w-6 text-center text-blue-950">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="text-2xl font-black text-blue-950 hover:text-blue-600 transition-colors">+</button>
                    </div>
                    <Button 
                      onClick={handleAddToCart}
                      className="w-full sm:flex-1 h-16 bg-blue-950 hover:bg-blue-900 text-white font-black rounded-xl text-lg uppercase tracking-wider transition-all shadow-[4px_4px_0_0_#1e3a8a] border-2 border-transparent active:translate-y-1 active:shadow-none"
                    >
                      <ShoppingCart className="w-6 h-6 mr-3 text-yellow-400" />
                      Comprar Agora
                    </Button>
                  </div>
                  
                  <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full h-16 bg-green-500 hover:bg-green-600 text-blue-950 border-2 border-blue-950 font-black rounded-xl text-lg uppercase tracking-wider transition-all shadow-[4px_4px_0_0_#1e3a8a] active:translate-y-1 active:shadow-none">
                      <MessageCircle className="w-6 h-6 mr-3 fill-blue-950 text-blue-950" />
                      Chamar no WhatsApp
                    </Button>
                  </a>
                </div>
              </div>

              {/* Specs Thematic */}
              {((product.features && product.features.length > 0) || product.category !== 'pecas') && (
              <div className="bg-blue-950 rounded-[2rem] p-8 border-4 border-blue-950 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] text-white">
                <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest flex items-center gap-3 mb-6">
                  <Star className="w-6 h-6 fill-yellow-400" />
                  Mochila de Recursos
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {((product.features && product.features.length > 0) ? product.features : ["Kit completo de automação", "Sensor antiesmagamento", "Controle remoto", "Manual de instalação"]).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/10 rounded-xl border border-white/20 shadow-inner">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Check className="w-5 h-5 text-blue-950 stroke-[3px]" />
                      </div>
                      <span className="text-sm font-bold text-white/90">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Demonstration Section */}
      {product.videoUrl && (
        <section ref={videoSectionRef} className="py-20 bg-slate-900 text-white relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest mb-3">
                <Video className="w-4 h-4" />
                Demonstração em Vídeo
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Veja o Kit em Funcionamento
              </h2>
              <p className="text-slate-400 mt-2 font-medium">
                Assista ao vídeo explicativo e veja a facilidade da instalação e operação do sistema de automação.
              </p>
            </div>

            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md p-2">
              {getYouTubeId(product.videoUrl) ? (
                <div className="aspect-video w-full rounded-2xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${getYouTubeId(product.videoUrl)}`}
                    title="Vídeo Demonstrativo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center relative group">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                  >
                    <source src={product.videoUrl} type="video/mp4" />
                    Seu navegador não suporta a reprodução de vídeos.
                  </video>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Comparative Table Softened */}
      {product.category !== 'pecas' && (
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
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-blue-600 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-blue-600 mx-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}

      <CartNotification 
        productName={addedProduct?.name || ""} 
        isOpen={!!addedProduct} 
        onClose={() => setAddedProduct(null)} 
      />
    </Layout>
  );
};

export default ProductDetail;
