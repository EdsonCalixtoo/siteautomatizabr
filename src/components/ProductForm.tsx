import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Tag, Package, Zap, AlertCircle, Upload, ChevronUp, ChevronDown, Trash2, Plus, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProducts, type Product } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";

// Import removido para usar categorias do contexto
// import { CATEGORIES, CATEGORY_LABELS } from "@/data/categories";

interface ProductFormProps {
  onClose: () => void;
  product?: any;
}

export function ProductForm({ onClose, product }: ProductFormProps) {
  const { addProduct, updateProduct, products, categories, subcategories } = useProducts();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoFileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || (categories[0]?.key || "completo"),
    subcategory: product?.subcategory || (subcategories.find(s => s.categoryId === categories[0]?.id)?.name || ""),
    price: product?.price || 0,
    stock: product?.stock || 0,
    image: product?.image || "",
    sku: (product as any)?.sku || "",
    weight: (product as any)?.weight || "",
    dimensions: (product as any)?.dimensions || "",
    warranty: (product as any)?.warranty || "12 meses",
    material: (product as any)?.material || "",
    status: (product as any)?.status || "ativo",
    badge: (product as any)?.badge || "",
    shortDescription: (product as any)?.shortDescription || "",
    originalPrice: (product as any)?.originalPrice || 0,
    videoUrl: (product as any)?.videoUrl || "",
    audioUrl: (product as any)?.audioUrl || "",
  });

  const [features, setFeatures] = useState<string[]>(
    product?.features || []
  );
  const [newFeature, setNewFeature] = useState("");
  const [images, setImages] = useState<string[]>(
    product?.image ? [product.image] : []
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeSection, setActiveSection] = useState<"basico" | "tecnico">("basico");
  const [displayPrice, setDisplayPrice] = useState<string>(
    formData.price > 0 
      ? new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(formData.price)
      : ""
  );

  // Sincroniza displayPrice quando o produto para edição muda
  useEffect(() => {
    if (product?.price) {
      setDisplayPrice(
        new Intl.NumberFormat("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(product.price)
      );
    }
  }, [product?.price]);

  const handlePriceChange = (input: string) => {
    // Remove tudo que não é número
    const numericOnly = input.replace(/\D/g, "");
    
    if (numericOnly === "") {
      setFormData({ ...formData, price: 0 });
      setDisplayPrice("");
      return;
    }

    // Converte de centavos para reais (últimos 2 dígitos são centavos)
    const value = parseInt(numericOnly, 10);
    const realValue = value / 100;

    // Atualiza o state com o valor numérico
    setFormData({ ...formData, price: realValue });

    // Formata para exibição
    const formatted = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(realValue);

    setDisplayPrice(formatted);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("❌ Arquivo inválido. Selecione um arquivo de vídeo (MP4, WebM, etc.)");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert(`❌ Vídeo muito grande (máx 100MB, seu arquivo tem ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const videoData = event.target?.result as string;
      setFormData({ ...formData, videoUrl: videoData });
      console.log("✅ Vídeo carregado!");
    };
    reader.onerror = () => alert("❌ Erro ao carregar o vídeo");
    reader.readAsDataURL(file);

    if (videoFileInputRef.current) videoFileInputRef.current.value = "";
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    
    // Primeiro, validar todos os arquivos
    Array.from(files).forEach((file) => {
      // Validar tipo de arquivo
      if (!file.type.startsWith("image/")) {
        alert(`❌ ${file.name} - Não é uma imagem válida`);
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`❌ ${file.name} - Muito grande (máx 5MB, seu arquivo tem ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) {
      alert("Nenhuma imagem válida foi selecionada");
      return;
    }

    console.log(`📸 Carregando ${validFiles.length} imagem(ns)...`);
    
    // Processar os arquivos válidos
    const promises = validFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          resolve(imageData);
        };
        reader.onerror = () => {
          alert(`❌ Erro ao carregar ${file.name}`);
          resolve(""); // Retorna vazio em caso de erro
        };
        reader.readAsDataURL(file);
      });
    });

    // Aguardar todas as imagens serem processadas
    Promise.all(promises).then((newImagesList) => {
      const validImages = newImagesList.filter((img) => img !== "");
      console.log(`✅ ${validImages.length} imagem(ns) carregada(s)`);
      setImages([...images, ...validImages]);
    });

    // Resetar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // Se removeu a imagem principal, atualiza
    if (index === 0) {
      setFormData({ ...formData, image: newImages[0] || "" });
    }
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === images.length - 1)
    ) {
      return;
    }

    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[targetIndex]] = [
      newImages[targetIndex],
      newImages[index],
    ];
    
    setImages(newImages);
    
    // Atualiza a imagem principal se necessário
    if (index === 0 || targetIndex === 0) {
      setFormData({ ...formData, image: newImages[0] || "" });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (formData.price <= 0) newErrors.price = "Preço deve ser maior que 0";
    if (formData.stock < 0) newErrors.stock = "Estoque não pode ser negativo";

    if (formData.sku && formData.sku.trim()) {
      const isDuplicate = products.some(p => 
        p.sku?.trim().toUpperCase() === formData.sku.trim().toUpperCase() && 
        p.id !== product?.id
      );
      if (isDuplicate) newErrors.sku = "Este SKU já está em uso por outro produto";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const dataToSave = {
      ...formData,
      sku: formData.sku || `SKU-${Date.now()}`,
      images: images.length > 0 ? images : (product?.image ? [product.image] : []),
      image: images[0] || formData.image,
      features: features.filter(f => f.trim() !== ""),
    };

    if (product && product.id) {
      updateProduct(product.id, dataToSave);
    } else {
      addProduct(dataToSave);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-cyan-500/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 flex items-center justify-between border-b border-white/10">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-2">
              {product && product.id ? "Editar Produto" : product ? "Duplicar Produto" : "Novo Produto"}
            </h2>
            {product && product.id && (
              <p className="text-cyan-100 text-sm mt-1">ID: {product.id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10 bg-black/20 sticky top-16 backdrop-blur-md">
          <button
            onClick={() => setActiveSection("basico")}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${
              activeSection === "basico"
                ? "bg-cyan-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Tag className="w-4 h-4 inline mr-2" />
            Informações Básicas
          </button>
          <button
            onClick={() => setActiveSection("tecnico")}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${
              activeSection === "tecnico"
                ? "bg-cyan-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            Dados Técnicos
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!user && (
            <div className="bg-yellow-900/40 border-2 border-yellow-500/60 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-bold text-sm">Atenção: Sem autenticação</p>
                <p className="text-yellow-200 text-xs">Você não está logado. Este produto será salvo apenas localmente.</p>
              </div>
            </div>
          )}

          {/* SEÇÃO BÁSICA */}
          {activeSection === "basico" && (
            <div className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label className="text-white font-bold">Nome do Produto *</Label>
                <Input
                  type="text"
                  placeholder="Ex: Kit Completo - Motor com Sensor"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`bg-white/10 border-2 text-white placeholder:text-gray-400 ${
                    errors.name ? "border-red-500" : "border-cyan-500/30"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm font-bold">{errors.name}</p>
                )}
              </div>

              {/* Descrição Curta */}
              <div className="space-y-2">
                <Label className="text-white font-bold">Resumo / Descrição Curta</Label>
                <Input
                  type="text"
                  placeholder="Ex: Sistema completo com sensor anti-esmagamento"
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  className="bg-white/10 border-2 border-cyan-500/30 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Descrição Completa */}
              <div className="space-y-2">
                <Label className="text-white font-bold">Descrição *</Label>
                <textarea
                  placeholder="Descreva os detalhes do produto, características, especificações..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className={`w-full bg-white/10 border-2 text-white placeholder:text-gray-400 rounded-xl p-4 font-sans resize-none ${
                    errors.description ? "border-red-500" : "border-cyan-500/30"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm font-bold">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* O que está incluso */}
              <div className="space-y-3">
                <Label className="text-white font-bold">O que está incluso</Label>
                <p className="text-gray-400 text-sm">Adicione os itens inclusos no produto</p>
                
                {/* Lista de Features */}
                {features.length > 0 && (
                  <div className="space-y-2 bg-white/5 rounded-xl p-3 border border-cyan-500/20">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between gap-2 bg-white/10 p-2 rounded-lg">
                        <span className="text-white text-sm flex-1">✓ {feature}</span>
                        <button
                          type="button"
                          onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                          className="p-1 hover:bg-red-600/50 text-red-400 rounded transition-all"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Adicionar novo feature */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ex: Motor com sensor, Controle remoto..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && newFeature.trim()) {
                        e.preventDefault();
                        setFeatures([...features, newFeature.trim()]);
                        setNewFeature("");
                      }
                    }}
                    className="flex-1 bg-white/10 border-2 border-cyan-500/30 text-white placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeature.trim()) {
                        setFeatures([...features, newFeature.trim()]);
                        setNewFeature("");
                      }
                    }}
                    className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all text-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Categoria e Subcategoria */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Categoria *</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCategoryKey = e.target.value;
                      const selectedCat = categories.find(c => c.key === newCategoryKey);
                      const relevantSubs = subcategories.filter(s => s.categoryId === selectedCat?.id);
                      setFormData({
                        ...formData,
                        category: newCategoryKey,
                        subcategory: relevantSubs[0]?.name || "",
                      });
                    }}
                    className="w-full bg-white/10 border-2 border-cyan-500/30 text-white rounded-xl p-3 font-semibold hover:border-cyan-500/60 transition-all"
                  >
                    {/* Incluir a categoria atual mesmo que não esteja na lista padrão para evitar erro */}
                    {!categories.some(c => c.key === formData.category) && formData.category && (
                      <option value={formData.category} className="bg-slate-900 italic">
                        {formData.category} (Personalizada)
                      </option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.key} className="bg-slate-900">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-bold">Subcategoria *</Label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) =>
                      setFormData({ ...formData, subcategory: e.target.value })
                    }
                    className="w-full bg-white/10 border-2 border-cyan-500/30 text-white rounded-xl p-3 font-semibold hover:border-cyan-500/60 transition-all"
                  >
                    {subcategories
                      .filter(s => s.categoryId === categories.find(c => c.key === formData.category)?.id)
                      .map((sub) => (
                        <option key={sub.id} value={sub.name} className="bg-slate-900">
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Preço e Estoque */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Preço (R$) *
                  </Label>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-xl p-3 border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300 focus-within:border-cyan-500/80 focus-within:shadow-lg focus-within:shadow-cyan-500/20">
                    <span className="text-green-400 font-black text-lg">R$</span>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0,00"
                      value={displayPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-500 focus:outline-none text-lg font-semibold"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-400 text-xs font-bold flex items-center gap-1">⚠️ {errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    Estoque *
                  </Label>
                  <div className="bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-xl p-3 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 focus-within:border-yellow-500/80 focus-within:shadow-lg focus-within:shadow-yellow-500/20">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-transparent border-0 text-white placeholder:text-gray-500 focus:outline-none text-lg font-semibold w-full"
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-red-400 text-xs font-bold flex items-center gap-1">⚠️ {errors.stock}</p>
                  )}
                </div>
              </div>

              {/* SKU, Badge e Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    SKU (opcional)
                  </Label>
                  <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-3 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                    <Input
                      type="text"
                      placeholder="SKU-001"
                      value={formData.sku}
                      onChange={(e) =>
                        setFormData({ ...formData, sku: e.target.value })
                      }
                      className="bg-transparent border-0 text-white placeholder:text-gray-500 focus:outline-none w-full font-semibold"
                    />
                  </div>
                  {errors.sku && (
                    <p className="text-red-400 text-xs font-bold flex items-center gap-1">⚠️ {errors.sku}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    Selo / Badge
                  </Label>
                  <div className="bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-xl p-3 border-2 border-amber-500/30 hover:border-amber-500/60 transition-all duration-300">
                    <Input
                      type="text"
                      placeholder="Ex: Mais Vendido, Oferta"
                      value={formData.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      className="bg-transparent border-0 text-white placeholder:text-gray-500 focus:outline-none w-full font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    Status
                  </Label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-2 border-blue-500/30 text-white rounded-xl p-3 font-semibold hover:border-blue-500/60 transition-all cursor-pointer appearance-none"
                  >
                    <option value="ativo" className="bg-slate-900">
                      ✓ Ativo
                    </option>
                    <option value="inativo" className="bg-slate-900">
                      ✗ Inativo
                    </option>
                  </select>
                </div>
              </div>

              {/* Múltiplas Imagens */}
              <div className="space-y-3">
                <Label className="text-white font-bold">Imagens do Produto</Label>
                <p className="text-gray-400 text-sm">Selecione uma ou múltiplas imagens. A primeira será a principal.</p>
                
                {/* Input file hidden */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultipleImageUpload}
                  className="hidden"
                />

                {/* Botão Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-xl transition-all flex flex-col items-center gap-3 hover:bg-white/5 group"
                >
                  <div className="p-3 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg group-hover:from-purple-600/40 group-hover:to-pink-600/40 transition-all">
                    <Upload className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold">Clique para adicionar imagens</p>
                    <p className="text-gray-400 text-sm">ou arraste e solte aqui</p>
                  </div>
                </button>

                {/* Galeria de Imagens */}
                {images.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <p className="text-white font-bold text-sm">
                      {images.length} imagem{images.length > 1 ? "s" : ""} selecionada{images.length > 1 ? "s" : ""}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group rounded-xl overflow-hidden border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all"
                        >
                          {/* Imagem */}
                          <img
                            src={image}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150";
                            }}
                          />

                          {/* Badge Principais */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                              Principal
                            </div>
                          )}

                          {/* Controles */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                            {/* Botões Reordenação */}
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => moveImage(index, "up")}
                                disabled={index === 0}
                                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
                                title="Mover para cima"
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImage(index, "down")}
                                disabled={index === images.length - 1}
                                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all disabled:opacity-50"
                                title="Mover para baixo"
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Botão Remover */}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all w-full"
                              title="Remover"
                            >
                              <Trash2 className="w-4 h-4 mx-auto" />
                            </button>
                          </div>

                          {/* Número da imagem */}
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Info Dica */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-300 text-xs">
                        Reordene as imagens usando os botões. A primeira imagem será usada como capa do produto.
                      </p>
                    </div>
                  </div>
                )}

                {/* Input URL para adicionar por link */}
                {images.length > 0 && (
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <Label className="text-gray-400 text-xs font-bold">Ou adicionar imagem por URL</Label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        placeholder="https://exemplo.com/imagem.jpg"
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                            const url = (e.target as HTMLInputElement).value;
                            setImages([...images, url]);
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                        className="flex-1 bg-white/10 border-2 border-cyan-500/30 text-white placeholder:text-gray-400 h-10"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                          if (input.value) {
                            setImages([...images, input.value]);
                            input.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all font-semibold text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ========== SEÇÃO DE VÍDEO ========== */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <Label className="text-white font-bold">Vídeo do Produto</Label>
                </div>
                <p className="text-gray-400 text-sm">Adicione um vídeo demonstrativo que aparecerá na página do produto.</p>

                {/* Input file video hidden */}
                <input
                  ref={videoFileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />

                {/* Botão usar vídeo padrão */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, videoUrl: "/video-demonstrativo.mp4" })}
                  className="w-full py-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500/50 hover:border-purple-500 rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-purple-600/20 group"
                >
                  <div className="p-2 bg-purple-600/30 rounded-lg group-hover:bg-purple-600/50 transition-all">
                    <Video className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Usar vídeo demonstrativo padrão</p>
                    <p className="text-gray-400 text-xs">video-demonstrativo.mp4 (já cadastrado no sistema)</p>
                  </div>
                  {formData.videoUrl === "/video-demonstrativo.mp4" && (
                    <span className="ml-auto text-green-400 text-xs font-bold bg-green-400/20 px-2 py-1 rounded-lg">✓ Selecionado</span>
                  )}
                </button>

                {/* OU fazer upload */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-gray-500 text-xs font-bold">OU</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <button
                  type="button"
                  onClick={() => videoFileInputRef.current?.click()}
                  className="w-full py-3 border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-white/5 group"
                >
                  <div className="p-2 bg-purple-600/20 rounded-lg group-hover:bg-purple-600/40 transition-all">
                    <Upload className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Fazer upload de vídeo</p>
                    <p className="text-gray-400 text-xs">MP4, WebM, MOV — máx. 100MB</p>
                  </div>
                </button>

                {/* Preview do vídeo selecionado */}
                {formData.videoUrl && (
                  <div className="space-y-2">
                    <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/40 bg-black aspect-video">
                      <video
                        key={formData.videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        poster="/ftproduto.jpeg"
                      >
                        <source src={formData.videoUrl} />
                        Seu navegador não suporta vídeos.
                      </video>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-green-400 text-xs font-bold flex items-center gap-1">
                        <span>✓</span>
                        <span>
                          {formData.videoUrl === "/video-demonstrativo.mp4"
                            ? "Vídeo padrão selecionado"
                            : formData.videoUrl.startsWith("data:")
                            ? "Vídeo carregado do computador"
                            : "Vídeo por URL"}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, videoUrl: "" })}
                        className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Remover
                      </button>
                    </div>
                  </div>
                )}

                {/* Campo URL manual (opcional) */}
                {!formData.videoUrl && (
                  <div className="pt-1">
                    <Label className="text-gray-400 text-xs font-bold">Ou cole um link de YouTube / URL do vídeo</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="text"
                        placeholder="https://youtube.com/watch?v=... ou link .mp4"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const val = (e.target as HTMLInputElement).value;
                            if (val) setFormData({ ...formData, videoUrl: val });
                          }
                        }}
                        className="flex-1 bg-white/10 border-2 border-purple-500/30 text-white placeholder:text-gray-500 h-10"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value) setFormData({ ...formData, videoUrl: input.value });
                        }}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-semibold text-sm"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEÇÃO TÉCNICA */}
          {activeSection === "tecnico" && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-300 text-sm">
                  Esses dados ajudam na logística e descrição técnica do produto
                </p>
              </div>

              {/* Material e Cor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Material/Tipo</Label>
                  <Input
                    type="text"
                    placeholder="Ex: Aço Inoxidável"
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                    className="bg-white/10 border-2 border-cyan-500/30 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white font-bold">Peso</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Ex: 500g"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: e.target.value })
                      }
                      className="flex-1 bg-white/10 border-2 border-cyan-500/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Dimensões */}
              <div className="space-y-2">
                <Label className="text-white font-bold">
                  Dimensões (A × L × P)
                </Label>
                <Input
                  type="text"
                  placeholder="Ex: 30cm × 20cm × 10cm"
                  value={formData.dimensions}
                  onChange={(e) =>
                    setFormData({ ...formData, dimensions: e.target.value })
                  }
                  className="bg-white/10 border-2 border-cyan-500/30 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Mídia (Vídeo e Áudio) */}
              <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl p-4 md:p-6 border border-purple-500/30 space-y-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  Status do Vídeo
                </h3>

                {formData.videoUrl ? (
                  <div className="space-y-2">
                    <p className="text-green-400 text-sm font-bold flex items-center gap-2">
                      <span>✓</span>
                      Vídeo configurado — veja e edite na aba <span className="underline cursor-pointer" onClick={() => setActiveSection("basico")}>Informações Básicas</span>
                    </p>
                    <p className="text-gray-400 text-xs break-all">
                      {formData.videoUrl.startsWith("data:") ? "📁 Arquivo carregado do computador" : formData.videoUrl}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-3">Nenhum vídeo configurado ainda.</p>
                    <button
                      type="button"
                      onClick={() => setActiveSection("basico")}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-sm transition-all"
                    >
                      ← Ir para Informações Básicas para adicionar vídeo
                    </button>
                  </div>
                )}

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Label className="text-white font-bold text-xs uppercase">Áudio (MP3 URL)</Label>
                  <Input
                    type="text"
                    placeholder="Ex: https://.../demo.mp3"
                    value={formData.audioUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, audioUrl: e.target.value })
                    }
                    className="bg-white/10 border-2 border-pink-500/30 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Garantia */}
              <div className="space-y-2">
                <Label className="text-white font-bold">Período de Garantia</Label>
                <select
                  value={formData.warranty}
                  onChange={(e) =>
                    setFormData({ ...formData, warranty: e.target.value })
                  }
                  className="w-full bg-white/10 border-2 border-cyan-500/30 text-white rounded-xl p-3 font-semibold"
                >
                  <option value="6 meses" className="bg-slate-900">
                    6 Meses
                  </option>
                  <option value="12 meses" className="bg-slate-900">
                    12 Meses
                  </option>
                  <option value="24 meses" className="bg-slate-900">
                    24 Meses
                  </option>
                  <option value="sem garantia" className="bg-slate-900">
                    Sem Garantia
                  </option>
                </select>
              </div>

              {/* Resumo */}
              <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-4 space-y-3">
                <p className="text-white font-bold">📋 Resumo do Produto</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Nome:</p>
                    <p className="text-cyan-300 font-semibold">
                      {formData.name || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Preço:</p>
                    <p className="text-green-300 font-semibold">
                      {formatCurrency(formData.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Estoque:</p>
                    <p className="text-yellow-300 font-semibold">
                      {formData.stock} unidades
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status:</p>
                    <p
                      className={`font-semibold ${
                        formData.status === "ativo"
                          ? "text-green-300"
                          : "text-red-300"
                      }`}
                    >
                      {formData.status === "ativo" ? "✓ Ativo" : "✗ Inativo"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 text-lg uppercase tracking-wider"
            >
              ✕ Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-lg uppercase tracking-widest relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {product && product.id ? "🔄 Atualizar" : "✨ Criar"} Produto
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
