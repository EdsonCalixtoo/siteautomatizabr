import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/ProductContext";
import { ArrowLeft, Check, Shield, Truck, MessageCircle, Phone, Sparkles, Star, Zap, Award, Users, Video, Lightbulb, Clock, ChevronDown, ShoppingCart, Music, PlayCircle, PartyPopper } from "lucide-react";
import { useState, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { CartNotification } from "@/components/cart/CartNotification";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { products, loading } = useProducts();
  
  // Tenta encontrar o produto por ID exato ou por correspondência parcial
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
          <p className="text-lg text-gray-600">Carregando produto...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-bold mb-4">Produto não encontrado</h1>
          <p className="text-gray-600 mb-6">ID procurado: {id}</p>
          <p className="text-gray-500 mb-6 text-sm">Produtos disponíveis: {products.length}</p>
          <Link to="/produtos">
            <Button variant="default">
              <ArrowLeft className="w-4 h-4" />
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
      {/* Hero Header */}
      <div className="pt-20 md:pt-28 pb-8 md:pb-12 bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 md:w-96 md:h-96 bg-white/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/produtos" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 md:mb-6 text-sm md:text-base">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Produtos</span>
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-8 md:py-16 relative bg-white">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">
            {/* Image Section with Gallery */}
            <div className="space-y-4 md:space-y-6 md:sticky md:top-32">
              {/* Main Image */}
              <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl md:rounded-3xl overflow-hidden border-2 border-cyan-100 shadow-lg md:shadow-2xl group">
                <div className="absolute top-3 md:top-6 left-3 md:left-6 z-20 flex flex-col gap-2">
                  {product.badge && (
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-bold shadow-lg animate-pulse">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                      {product.badge}
                    </span>
                  )}
                  <span className="bg-gradient-to-r from-amber-500 to-yellow-400 text-amber-950 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-black uppercase tracking-tighter shadow-xl flex items-center gap-1.5 border-2 border-amber-400/50">
                    <Star className="w-4 h-4 md:w-5 md:h-5 fill-amber-950" /> 10 ANOS DE TRADIÇÃO
                  </span>
                </div>
                
                <div className="aspect-square flex items-center justify-center py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-cyan-50 to-white relative overflow-hidden">
                  {product.images && product.images.length > 0 && product.images[selectedImage] ? (
                    <img 
                      src={product.images[selectedImage]} 
                      alt={`${product.name} - Imagem ${selectedImage + 1}`}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="relative">
                      <div className="w-40 h-40 md:w-56 md:h-56 rounded-2xl md:rounded-3xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center shadow-xl md:shadow-2xl group-hover:shadow-2xl md:group-hover:shadow-3xl transition-all">
                        <div className="w-28 h-28 md:w-40 md:h-40 rounded-lg md:rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Zap className="w-14 h-14 md:w-20 md:h-20 text-white/60" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="absolute bottom-6 left-6 right-6 flex gap-2 flex-wrap">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-cyan-700 border border-cyan-100 flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> 4.9/5 (327)
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-semibold text-cyan-700 border border-cyan-100 flex items-center gap-1 shadow-lg">
                    <Award className="w-4 h-4" /> Premium
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg md:rounded-xl border-2 transition-all overflow-hidden flex items-center justify-center ${
                        selectedImage === idx 
                          ? "border-cyan-600 shadow-lg" 
                          : "border-gray-200 hover:border-cyan-300"
                      }`}
                    >
                      <img 
                        src={img}
                        alt={`Imagem ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Imagem";
                        }}
                      />
                    </button>
                  ))
                ) : (
                  [0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg md:rounded-xl border-2 transition-all overflow-hidden bg-gradient-to-br from-gray-50 to-white flex items-center justify-center text-xs md:text-sm ${
                        selectedImage === idx 
                          ? "border-cyan-600 shadow-lg" 
                          : "border-gray-200 hover:border-cyan-300"
                      }`}
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center">
                        <Zap className="w-3 h-3 md:w-5 md:h-5 text-white/70" />
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Video Button */}
              {product.videoUrl && (
                <button 
                  onClick={scrollToVideo}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 md:py-4 rounded-full font-bold flex items-center justify-center gap-2 md:gap-3 shadow-lg hover:shadow-xl transition-all group text-sm md:text-base cursor-pointer"
                >
                  <Video className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                  Ver Vídeo do Produto
                </button>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-6 md:space-y-8">
              {/* Category */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                  <span className="inline-flex items-center gap-1 md:gap-2 bg-cyan-100 text-cyan-700 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {product.category === "completo" ? "🏆 Kit Completo" : 
                     product.category === "simples" ? "⚡ Kit Simples" : "🔧 Acessório"}
                  </span>
                  {product.subcategory && (
                    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs font-semibold">
                      {product.subcategory}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-sm md:text-base lg:text-lg">{product.description}</p>
              </div>

              {/* Price Section - PREMIUM LIGHT VERSION */}
              <div className="bg-gradient-to-br from-white via-amber-50/10 to-cyan-50/10 rounded-xl md:rounded-3xl p-6 md:p-8 border-2 border-cyan-100 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all" />
                
                <div className="relative space-y-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-cyan-600 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                      <PartyPopper className="w-4 h-4" /> 
                      Oferta Festiva de 10 Anos
                    </span>
                    <div className="flex items-end gap-3">
                      {(product.originalPrice ?? 0) > 0 && (
                        <span className="text-slate-400 line-through text-lg md:text-xl">
                          {formatCurrency(product.originalPrice!)}
                        </span>
                      )}
                      <span className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-cyan-50/50 border border-cyan-100 rounded-2xl p-4 transition-all hover:bg-cyan-100/50">
                      <p className="text-cyan-700 text-[10px] font-bold uppercase mb-1">Pagamento Parcelado</p>
                      <p className="text-gray-900 font-bold text-sm md:text-base">
                        Até <span className="text-cyan-600 text-lg md:text-xl">10x Sem Juros</span>
                      </p>
                      <p className="text-slate-500 text-[10px]">de {formatCurrency(product.price / 10)} / mês</p>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 transition-all hover:bg-amber-100/50">
                      <p className="text-amber-600 text-[10px] font-bold uppercase mb-1">Cupom Especial</p>
                      <p className="text-amber-900 font-black text-sm md:text-lg tracking-tighter">10ANOSAUTOMATIZA</p>
                      <p className="text-amber-700/80 text-[10px]">Aplique no checkout</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                      <Truck className="w-4 h-4" /> FRETE GRÁTIS BRASIL
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs">
                      <Zap className="w-4 h-4" /> ENVIO EM 24H
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                  O que está incluso:
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 md:gap-3">
                  {(product.features && product.features.length > 0 
                    ? product.features 
                    : product.images && product.images.length > 0 
                    ? product.images.map(img => `Inclui: ${product.name}`) 
                    : product.description 
                    ? [product.description.substring(0, 50) + "..."] 
                    : ["Produto de alta qualidade"]
                  ).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 md:gap-3 bg-white p-2 md:p-3 rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all">
                      <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-gray-700 text-xs sm:text-sm md:text-base font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4 md:space-y-5">
                <div className="flex items-center gap-3 md:gap-4 bg-white border-2 border-gray-200 rounded-lg md:rounded-xl p-2 w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-100 hover:bg-cyan-100 transition-colors font-bold text-gray-900 text-sm md:text-base"
                  >
                    −
                  </button>
                  <span className="w-6 md:w-8 text-center font-bold text-gray-900 text-sm md:text-base">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-gray-100 hover:bg-cyan-100 transition-colors font-bold text-gray-900 text-sm md:text-base"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col gap-2 md:gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full rounded-full font-bold text-sm md:text-base py-2 md:py-3 transition-all bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                  <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button 
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full font-bold text-sm md:text-base py-2 md:py-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                      Comprar pelo WhatsApp
                    </Button>
                  </a>
                  <a href="tel:+5519989429972" className="w-full">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="w-full rounded-full font-bold text-sm md:text-base py-2 md:py-3 border-2 hover:bg-gray-50"
                    >
                      <Phone className="w-4 h-4 md:w-5 md:h-5" />
                      Ligar Agora
                    </Button>
                  </a>
                </div>
              </div>

              {/* Trust Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-blue-50 rounded-full border-2 border-blue-200 hover:shadow-md transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs md:text-sm">{product.warranty}</p>
                    <p className="text-xs text-gray-600">Garantia</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-green-50 rounded-full border-2 border-green-200 hover:shadow-md transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-xs md:text-sm">Envio Seguro</p>
                    <p className="text-xs text-gray-600">Brasil todo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video & Audio Section */}
      {(product.videoUrl || product.audioUrl) && (
        <section ref={videoSectionRef} className="py-12 md:py-20 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500 via-transparent to-transparent pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto space-y-12">
              {/* Video */}
              {product.videoUrl && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 justify-center mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <PlayCircle className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-slate-900">Demonstração em Vídeo</h2>
                  </div>

                  <div className="rounded-2xl md:rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-black aspect-video relative group">
                    {getYouTubeId(product.videoUrl) ? (
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeId(product.videoUrl)}`}
                        title="Product Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video 
                        controls 
                        className="w-full h-full object-contain"
                        poster={product.image}
                      >
                        <source src={product.videoUrl} type="video/mp4" />
                        Seu navegador não suporta vídeos.
                      </video>
                    )}
                  </div>
                </div>
              )}

              {/* Audio */}
              {product.audioUrl && (
                <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 border border-cyan-100 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg transform rotate-3 flex-shrink-0">
                      <Music className="w-8 md:w-10 h-8 md:h-10 text-white" />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 text-slate-900">Apresentação em Áudio</h3>
                      <p className="text-gray-500 text-sm md:text-base mb-6">Ouça os detalhes técnicos e benefícios deste produto</p>
                      <audio 
                        controls 
                        className="w-full custom-audio-player h-12 filter opacity-80 hover:opacity-100 transition-opacity"
                      >
                        <source src={product.audioUrl} type="audio/mpeg" />
                        Seu navegador não suporta áudio.
                      </audio>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tabela Comparativa */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 lg:mb-16 flex items-center gap-3">
            <span className="w-1 h-8 md:h-10 lg:h-12 bg-gradient-to-b from-cyan-600 to-cyan-500 rounded-full" />
            Comparação de Modelos
          </h2>

          <div className="overflow-x-auto bg-white rounded-lg md:rounded-2xl border-2 border-gray-200 shadow-xl">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <th className="px-3 md:px-6 py-2 md:py-4 text-left font-bold text-xs sm:text-sm md:text-base lg:text-lg">Características</th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg">ABNT</th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg">COM SENSOR</th>
                  <th className="px-2 md:px-6 py-2 md:py-4 text-center font-bold text-xs sm:text-sm md:text-base lg:text-lg">SEM SENSOR</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Acionador",
                  "Fixação Cremalheira",
                  "Central",
                  "Suporte da Coluna",
                  "Controle Remoto",
                  "Botão no Painel",
                  "Sinal Sonoro",
                  "Chicote com Sensor",
                  "Sensor Antiesmagamento",
                  "Sensor Antesmagamento",
                  "Borda Sensível Antiesmagamento",
                  "Proteção Cremalheira",
                  "Sinais Luminosos",
                  "Sensor Van Estacionada",
                  "Adesivos Conforme Norma ABNT",
                ].map((feature, idx) => {
                  const abnt = true;
                  const comSensor = true;
                  const semSensor = idx < 9 ? true : (idx === 8 ? false : idx === 10 ? false : idx === 11 ? false : idx === 12 ? false : idx === 13 ? false : idx === 14 ? false : true);
                  
                  return (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-gray-100 transition-colors"}>
                      <td className="px-2 md:px-6 py-2 md:py-4 font-semibold text-gray-900 border-r border-gray-200 text-xs sm:text-sm md:text-base">
                        {feature}
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 text-center border-r border-gray-200">
                        {abnt ? (
                          <Check className="w-4 h-4 md:w-6 md:h-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400 font-bold text-xs md:text-base">-</span>
                        )}
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 text-center border-r border-gray-200">
                        {comSensor ? (
                          <Check className="w-4 h-4 md:w-6 md:h-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400 font-bold text-xs md:text-base">✕</span>
                        )}
                      </td>
                      <td className="px-2 md:px-6 py-2 md:py-4 text-center">
                        {semSensor ? (
                          <Check className="w-4 h-4 md:w-6 md:h-6 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-gray-400 font-bold text-xs md:text-base">✕</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legenda */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <span className="text-gray-700">Incluído</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">✕</span>
              <span className="text-gray-700">Não incluído</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 lg:mb-16 flex items-center gap-3">
            <span className="w-1 h-8 md:h-10 bg-gradient-to-b from-cyan-600 to-cyan-500 rounded-full" />
            O Que Clientes Dizem
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { name: "João Silva", role: "Proprietário de Van", rating: 5, text: "Produto excelente! Instalação rápida e funciona perfeitamente." },
              { name: "Maria Santos", role: "Transportadora", rating: 5, text: "Melhorou muito minha produtividade. Muito bom mesmo!" },
              { name: "Carlos Oliveira", role: "Profissional Autônomo", rating: 5, text: "Suporte impecável, produto de qualidade superior." },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-lg md:rounded-2xl border-2 border-gray-100 p-4 md:p-6 hover:border-cyan-400 hover:shadow-xl transition-all">
                <div className="flex items-center gap-1 mb-3 md:mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 md:mb-6 font-medium text-sm md:text-base">{review.text}</p>
                <div className="border-t-2 border-gray-100 pt-3 md:pt-4">
                  <p className="font-bold text-gray-900 text-sm md:text-base">{review.name}</p>
                  <p className="text-xs md:text-sm text-gray-500">{review.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 md:mt-10 lg:mt-12 text-center">
            <p className="text-gray-600 mb-3 md:mb-4 flex items-center justify-center gap-2 text-sm md:text-base">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
              <span className="font-semibold">+1.200 clientes satisfeitos</span>
            </p>
          </div>
        </div>
      </section>

      {/* Garantia e Suporte Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 lg:mb-16 flex items-center gap-3">
            <span className="w-1 h-8 md:h-10 lg:h-12 bg-gradient-to-b from-cyan-600 to-cyan-500 rounded-full" />
            Garantia e Suporte
          </h2>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl border-2 border-cyan-300 p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-700 flex items-center justify-center mb-4 md:mb-6 shadow-lg">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">12 Meses de Garantia</h3>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                Cobertura completa de fábrica com suporte técnico para todo o Brasil. Sua tranquilidade é nossa prioridade.
              </p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl border-2 border-cyan-300 p-6 md:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 md:mb-6 shadow-lg">
                <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Suporte Completo</h3>
              <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed">
                Nossa equipe está pronta para te ajudar com qualquer dúvida sobre instalação ou uso do produto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 lg:mb-16 flex items-center gap-3">
            <span className="w-1 h-8 md:h-10 lg:h-12 bg-gradient-to-b from-cyan-600 to-cyan-500 rounded-full" />
            Perguntas Frequentes
          </h2>

          <div className="max-w-3xl mx-auto space-y-3 md:space-y-4">
            {[
              {
                q: "Serve para outros modelos de van?",
                a: "Não, este modelo é específico para o veículo indicado. Temos soluções personalizadas para cada modelo de van."
              },
              {
                q: "A instalação é complicada?",
                a: "Não! Temos todos os vídeos no site explicando como instalar. É fácil e rápido. Caso prefira, temos uma ampla rede de técnicos parceiros aptos para instalar sua Porta Automática em todo Brasil."
              },
              {
                q: "É seguro?",
                a: "Sim! Utilizamos os melhores materiais na produção. Nossas portas contam com sensor antiesmagamento e 12 meses de garantia."
              },
              {
                q: "Posso devolver?",
                a: "Se não ficar satisfeito com nosso produto no prazo de 30 dias, devolvemos seu dinheiro (consulte condições)."
              },
            ].map((faq, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                className="w-full bg-white rounded-lg md:rounded-2xl border-2 border-gray-200 hover:border-cyan-400 transition-all text-left overflow-hidden shadow-md hover:shadow-lg"
              >
                <div className="p-4 md:p-6 flex items-center justify-between gap-3">
                  <h3 className="text-sm md:text-base lg:text-lg font-bold text-gray-900 pr-2">{faq.q}</h3>
                  <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 text-cyan-600 flex-shrink-0 transition-transform ${expandedFAQ === idx ? 'rotate-180' : ''}`} />
                </div>
                
                {expandedFAQ === idx && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6 border-t-2 border-gray-100 bg-cyan-50">
                    <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-cyan-600 via-cyan-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 md:w-96 md:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 md:w-96 md:h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-3 md:px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            Garanta Mais Conforto e Praticidade
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-8 md:mb-12">
            Transforme a forma como você trabalha e ganhe mais tempo e segurança com a Porta Automática para Vans.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <a href="https://wa.me/5519989429972" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full bg-white text-cyan-600 hover:bg-gray-100 rounded-lg md:rounded-xl font-bold text-sm md:text-base lg:text-lg py-2 md:py-3 shadow-xl hover:shadow-2xl transition-all"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                Comprar Agora
              </Button>
            </a>
            <a href="tel:+5519989429972" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                size="lg"
                className="w-full text-white border-2 border-white hover:bg-white/10 rounded-lg md:rounded-xl font-bold text-sm md:text-base lg:text-lg py-2 md:py-3"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Ligar Agora
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 md:py-14 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8 lg:mb-12 flex items-center gap-3">
            <span className="w-1 h-8 md:h-10 bg-gradient-to-b from-cyan-600 to-cyan-500 rounded-full" />
            Produtos Relacionados
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <Link 
                key={item.id} 
                to={`/produto/${item.id}`}
                className="group bg-white rounded-lg md:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-cyan-400"
              >
                <div className="relative aspect-square bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=" + encodeURIComponent(item.name);
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center shadow-lg">
                      <Zap className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-6">
                  <h3 className="font-bold text-sm md:text-lg text-gray-900 mb-2 md:mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-lg md:text-2xl font-bold text-cyan-600">
                      {formatCurrency(item.price)}
                    </span>
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-cyan-600 group-hover:translate-x-1 transition-transform rotate-180 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
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

export default ProductDetail;
