import { useState } from "react";
import { X, Plus, Copy, Check, Tag, Percent, DollarSign, Calendar, Gift, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProducts, type Coupon } from "@/contexts/ProductContext";
import { formatPrice } from "@/lib/utils";

interface CouponFormProps {
  onClose: () => void;
  coupon?: Coupon;
}

export function CouponForm({ onClose, coupon }: CouponFormProps) {
  const { addCoupon, updateCoupon } = useProducts();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    code: coupon?.code || generateCouponCode(),
    description: coupon?.description || "",
    discountType: coupon?.discountType || "percentage",
    discountValue: coupon?.discountValue || 10,
    maxUses: coupon?.maxUses || 100,
    expiryDate: coupon?.expiryDate || "",
    active: coupon?.active ?? true,
  });

  function generateCouponCode() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon) {
      updateCoupon(coupon.id, { ...formData, currentUses: coupon.currentUses });
    } else {
      addCoupon({ ...formData, currentUses: 0 });
    }
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(formData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header com Gradiente */}
        <div className="sticky top-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white">
                {coupon ? "✏️ Editar Cupom" : "🎁 Novo Cupom"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Código do Cupom */}
          <div className="space-y-3">
            <Label htmlFor="code" className="text-gray-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-cyan-600" />
              Código do Cupom *
            </Label>
            <div className="flex gap-2">
              <div className="flex-1 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-3 border-2 border-cyan-300/50 hover:border-cyan-500/80 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-cyan-500/30">
                <Input
                  id="code"
                  type="text"
                  placeholder="EX: PROMO2024"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  required
                  disabled={!!coupon}
                  className="border-0 bg-transparent focus:outline-none text-lg font-black tracking-widest text-cyan-700 placeholder:text-cyan-400 uppercase"
                />
              </div>
              <button
                type="button"
                onClick={copyCode}
                className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg font-semibold"
                title="Copiar código"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-gray-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              Descrição *
            </Label>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 border-2 border-yellow-300/50 hover:border-yellow-500/80 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-yellow-500/30">
              <Input
                id="description"
                type="text"
                placeholder="Ex: Desconto para clientes novos"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="border-0 bg-transparent focus:outline-none text-base text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Tipo e Valor de Desconto */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-3">
              <Label
                htmlFor="discountType"
                className="text-gray-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2"
              >
                {formData.discountType === "percentage" ? <Percent className="w-4 h-4 text-purple-600" /> : <DollarSign className="w-4 h-4 text-green-600" />}
                Tipo *
              </Label>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border-2 border-purple-300/50 hover:border-purple-500/80 transition-all duration-300">
                <select
                  id="discountType"
                  value={formData.discountType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountType: e.target.value as "percentage" | "fixed",
                    })
                  }
                  className="w-full border-0 bg-transparent focus:outline-none font-semibold text-gray-700 cursor-pointer appearance-none"
                >
                  <option value="percentage">Percentual (%)</option>
                  <option value="fixed">Valor Fixo (R$)</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 col-span-2">
              <Label
                htmlFor="discountValue"
                className="text-gray-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <span className="w-4 h-4 flex items-center justify-center text-sm font-black">{formData.discountType === "percentage" ? "%" : "R$"}</span>
                Valor *
              </Label>
              <div className={`bg-gradient-to-r ${formData.discountType === "percentage" ? "from-purple-50 to-pink-50 border-purple-300/50" : "from-green-50 to-emerald-50 border-green-300/50"} rounded-xl p-3 border-2 hover:border-opacity-80 transition-all duration-300 focus-within:shadow-lg`}>
                <Input
                  id="discountValue"
                  type="number"
                  step={formData.discountType === "percentage" ? "1" : "0.01"}
                  min="0"
                  max={formData.discountType === "percentage" ? "100" : undefined}
                  placeholder="0"
                  value={formData.discountValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountValue: parseFloat(e.target.value),
                    })
                  }
                  required
                  className="border-0 bg-transparent focus:outline-none text-lg font-bold text-gray-700 placeholder:text-gray-400 w-full"
                />
              </div>
            </div>
          </div>

          {/* Limite de Uso */}
          <div className="space-y-3">
            <Label htmlFor="maxUses" className="text-gray-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-600" />
              Limite de Uso *
            </Label>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 border-2 border-orange-300/50 hover:border-orange-500/80 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-orange-500/30">
              <Input
                id="maxUses"
                type="number"
                min="1"
                placeholder="100"
                value={formData.maxUses}
                onChange={(e) =>
                  setFormData({ ...formData, maxUses: parseInt(e.target.value) })
                }
                required
                className="border-0 bg-transparent focus:outline-none text-lg font-bold text-gray-700 placeholder:text-gray-400 w-full"
              />
            </div>
          </div>

          {/* Data de Expiração */}
          <div className="space-y-3">
            <Label htmlFor="expiryDate" className="text-gray-700 font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Data de Expiração *
            </Label>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border-2 border-blue-300/50 hover:border-blue-500/80 transition-all duration-300 focus-within:shadow-lg focus-within:shadow-blue-500/30">
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                required
                className="border-0 bg-transparent focus:outline-none text-base text-gray-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300/50 hover:border-green-500/80 transition-all duration-300 cursor-pointer group">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) =>
                setFormData({ ...formData, active: e.target.checked })
              }
              className="w-6 h-6 rounded-lg border-2 border-green-500 text-green-600 cursor-pointer accent-green-600"
            />
            <Label htmlFor="active" className="font-bold text-gray-700 cursor-pointer flex-1 flex items-center gap-2">
              <span className="text-lg">✓</span> Cupom Ativo
            </Label>
            <span className={`text-sm font-bold px-3 py-1 rounded-full transition-colors ${formData.active ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}>
              {formData.active ? "ATIVO" : "INATIVO"}
            </span>
          </div>

          {/* Preview */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-blue-400/20 to-purple-400/20 border-2 border-dashed border-cyan-500/50 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-widest text-cyan-700 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4" /> Preview do Cupom
            </p>
            <div className="space-y-3 bg-white/80 rounded-xl p-4 backdrop-blur-sm border border-white/50">
              <p className="text-2xl font-black text-cyan-600 tracking-widest">{formData.code}</p>
              <p className="text-sm text-gray-600 font-medium">{formData.description}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-cyan-200">
                {formData.discountType === "percentage" ? (
                  <Percent className="w-5 h-5 text-purple-600" />
                ) : (
                  <DollarSign className="w-5 h-5 text-green-600" />
                )}
                <p className="font-bold text-gray-700">
                  {formData.discountType === "percentage"
                    ? `${formData.discountValue}% de desconto`
                    : `R$ ${formatPrice(formData.discountValue)} de desconto`}
                </p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-100">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 uppercase tracking-wider"
            >
              ✕ Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-black rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-widest relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {coupon ? "🔄 Atualizar Cupom" : "✨ Criar Cupom"}
              </span>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
