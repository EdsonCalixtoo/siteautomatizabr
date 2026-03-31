import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSellers, type Seller } from "@/contexts/SellerContext";

interface SellerFormProps {
  onClose: () => void;
  seller?: Seller;
}

const AVAILABLE_CATEGORIES = [
  "Portas Automáticas",
  "Kits Completos",
  "Peças Individuais",
  "Cremalheira",
  "Acessórios",
  "Manutenção",
];

export function SellerForm({ onClose, seller }: SellerFormProps) {
  const { addSeller, updateSeller } = useSellers();
  const [formData, setFormData] = useState({
    name: seller?.name || "",
    email: seller?.email || "",
    phone: seller?.phone || "",
    commissionRate: seller?.commissionRate || 10,
    categories: seller?.categories || [],
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (formData.commissionRate < 0 || formData.commissionRate > 100) {
      newErrors.commissionRate = "Comissão deve ser entre 0 e 100%";
    }
    if (formData.categories.length === 0) {
      newErrors.categories = "Selecione pelo menos uma categoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (seller) {
      updateSeller(seller.id, {
        ...formData,
        avatar: formData.name.charAt(0).toUpperCase(),
      });
    } else {
      addSeller({
        ...formData,
        avatar: formData.name.charAt(0).toUpperCase(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border-2 border-cyan-500/30 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 flex items-center justify-between border-b border-white/10">
          <h2 className="text-2xl font-black">
            {seller ? "Editar Vendedor" : "Novo Vendedor"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label className="text-white font-bold">Nome *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ex: Gustavo Silva"
              className={`bg-white/10 border-2 text-white placeholder:text-gray-400 ${
                errors.name ? "border-red-500" : "border-cyan-500/30"
              }`}
            />
            {errors.name && (
              <p className="text-red-400 text-sm font-bold">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-white font-bold">Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="email@example.com"
              className={`bg-white/10 border-2 text-white placeholder:text-gray-400 ${
                errors.email ? "border-red-500" : "border-cyan-500/30"
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm font-bold">{errors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label className="text-white font-bold">Telefone *</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              placeholder="(11) 98765-4321"
              className={`bg-white/10 border-2 text-white placeholder:text-gray-400 ${
                errors.phone ? "border-red-500" : "border-cyan-500/30"
              }`}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm font-bold">{errors.phone}</p>
            )}
          </div>

          {/* Comissão */}
          <div className="space-y-2">
            <Label className="text-white font-bold">Comissão (%) *</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={formData.commissionRate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  commissionRate: parseInt(e.target.value) || 0,
                }))
              }
              placeholder="10"
              className={`bg-white/10 border-2 text-white placeholder:text-gray-400 ${
                errors.commissionRate ? "border-red-500" : "border-cyan-500/30"
              }`}
            />
            {errors.commissionRate && (
              <p className="text-red-400 text-sm font-bold">
                {errors.commissionRate}
              </p>
            )}
          </div>

          {/* Categorias */}
          <div className="space-y-3">
            <Label className="text-white font-bold">Categorias *</Label>
            <p className="text-gray-400 text-sm">
              Selecione quais categorias este vendedor pode vender
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {AVAILABLE_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border-2 border-white/10 hover:border-cyan-500/50 cursor-pointer transition-all group"
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    className="w-5 h-5 rounded border-2 border-cyan-500 bg-cyan-500/20 cursor-pointer accent-cyan-500"
                  />
                  <span className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-red-400 text-sm font-bold">
                {errors.categories}
              </p>
            )}
          </div>

          {/* Acções */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              {seller ? "Atualizar" : "Criar"} Vendedor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
