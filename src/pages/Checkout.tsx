import { useState, FormEvent, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { createOrder, updateOrderStatus } from "@/lib/orderService";
import { Heart, Trash2, MapPin, CreditCard, ArrowLeft, Check, AlertCircle, Lock, Zap, Shield, Truck, Package, Loader, Gift, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { searchViaCEP } from "@/hooks/useViaCEP";
import { MercadoPagoPayment } from "@/components/MercadoPagoPayment";

// Função para gerar UUID v4
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

interface FormData {
  // Cliente
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  // Endereço
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  // Pagamento
  paymentMethod: "cartao" | "pix";
  // Cartão
  cardNumber: string;
  cardName: string;
  cardValidity: string;
  cardCVV: string;
  // Veículo
  anoVeiculo: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Checkout() {
  const { items, removeFromCart, total } = useCart();
  const { products, useCoupon } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    cpfCnpj: "",
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    number: "",
    complement: "",
    paymentMethod: "cartao",
    cardNumber: "",
    cardName: "",
    cardValidity: "",
    cardCVV: "",
    anoVeiculo: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingTime, setShippingTime] = useState("");
  const [shippingMethod, setShippingMethod] = useState<"entrega" | "retirada">("entrega");
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  const [orderCreated, setOrderCreated] = useState<any>(null);

  // Coupon discount states
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Memoizar o orderId para evitar re-renderizações desnecessárias do componente de pagamento
  const orderId = useState(() => generateUUID())[0];

  // Carregar dados do perfil quando usuário está logado
  useEffect(() => {
    if (user) {
      // Carregar dados salvos do usuário
      const saved = localStorage.getItem(`customer_${user.id}`);
      if (saved) {
        const customerData = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          name: customerData.name || "",
          email: user.email || "",
          phone: customerData.phone || "",
        }));
      } else {
        // Se não houver dados salvos, apenas preencher o email
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }));
      }
    }
  }, [user]);

  // Buscar endereço via ViaCEP
  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, cep: cleanCep }));
    setCepError(null);

    if (cleanCep.length === 8) {
      setCepLoading(true);

      const address = await searchViaCEP(cleanCep);

      if (address) {
        setFormData((prev) => ({
          ...prev,
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          state: address.state,
          complement: address.complement,
        }));

        // Calcular frete baseado no estado
        const shippingCosts: { [key: string]: { cost: number; time: string } } = {
          SP: { cost: 15.9, time: "2-3 dias úteis" },
          RJ: { cost: 18.5, time: "3-4 dias úteis" },
          MG: { cost: 19.9, time: "3-5 dias úteis" },
          BA: { cost: 29.9, time: "5-7 dias úteis" },
          RS: { cost: 24.9, time: "4-6 dias úteis" },
          PR: { cost: 17.5, time: "2-4 dias úteis" },
          SC: { cost: 22.5, time: "3-5 dias úteis" },
          PE: { cost: 28.5, time: "5-7 dias úteis" },
          CE: { cost: 29.9, time: "5-7 dias úteis" },
          GO: { cost: 26.5, time: "4-6 dias úteis" },
        };

        const shipping = shippingCosts[address.state] || {
          cost: 35.0,
          time: "7-10 dias úteis",
        };

        setShippingCost(shipping.cost);
        setShippingTime(shipping.time);
      } else {
        setCepError("CEP não encontrado. Verifique e tente novamente.");
        setFormData((prev) => ({
          ...prev,
          street: "",
          neighborhood: "",
          city: "",
          state: "",
          complement: "",
        }));
      }

      setCepLoading(false);
    }
  };

  // Aplicar cupom de desconto
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponMessage("Digite um código de cupom");
      setCouponApplied(false);
      return;
    }

    const result = useCoupon(couponCode);

    if (result.valid) {
      setCouponDiscount(result.discount || 0);
      setCouponMessage(result.message);
      setCouponApplied(true);
    } else {
      setCouponDiscount(0);
      setCouponMessage(result.message);
      setCouponApplied(false);
    }
  };

  // Remover cupom de desconto
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponDiscount(0);
    setCouponMessage("");
    setCouponApplied(false);
  };

  // Formatar telefone com máscara (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
  const handlePhoneChange = (value: string) => {
    const cleanPhone = value.replace(/\D/g, "");

    let formattedPhone = "";

    if (cleanPhone.length > 0) {
      if (cleanPhone.length <= 2) {
        // Apenas códígigo de área: (XX
        formattedPhone = `(${cleanPhone}`;
      } else if (cleanPhone.length <= 7) {
        // Até 7 dígitos: (XX) 9XXXX ou (XX) XXXX
        const areaCode = cleanPhone.substring(0, 2);
        const firstPart = cleanPhone.substring(2, 7);
        formattedPhone = `(${areaCode}) ${firstPart}`;
      } else {
        // Mais de 7 dígitos: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
        const areaCode = cleanPhone.substring(0, 2);
        const firstPart = cleanPhone.substring(2, 7);
        const secondPart = cleanPhone.substring(7, 11);
        formattedPhone = `(${areaCode}) ${firstPart}-${secondPart}`;
      }
    }

    setFormData((prev) => ({ ...prev, phone: formattedPhone }));
  };

  // Validar campos obrigatórios
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validação de cliente
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.cpfCnpj.trim()) newErrors.cpfCnpj = "CPF/CNPJ é obrigatório";
    if (!formData.anoVeiculo.trim()) newErrors.anoVeiculo = "Ano do veículo é obrigatório";
    if (formData.anoVeiculo && (isNaN(parseInt(formData.anoVeiculo)) || parseInt(formData.anoVeiculo) < 1970 || parseInt(formData.anoVeiculo) > 2030)) {
        newErrors.anoVeiculo = "Ano inválido (1970 - 2030)";
    }

    // Validação de endereço
    if (shippingMethod === "entrega") {
      if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório";
      if (!formData.street.trim()) newErrors.street = "Rua é obrigatória";
      if (!formData.neighborhood.trim()) newErrors.neighborhood = "Bairro é obrigatório";
      if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
      if (!formData.state.trim()) newErrors.state = "Estado é obrigatório";
      if (!formData.number.trim()) newErrors.number = "Número é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmData = async () => {
    if (!validateForm()) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    setLoading(true);
    try {
        const enrichedItems = items.map((item) => {
            const p = products.find((pr) => pr.id === item.id);
            return { ...item, category: p?.category || "" };
        });

        // Criar o pedido como "pendente" ANTES do pagamento para visibilidade no dashboard
        const order = await createOrder({
            cliente_nome: formData.name,
            cliente_email: formData.email,
            cliente_telefone: formData.phone,
            cliente_cpf_cnpj: formData.cpfCnpj,
            ano_veiculo: formData.anoVeiculo,
            endereco: {
                cep: formData.cep,
                rua: formData.street,
                numero: formData.number,
                bairro: formData.neighborhood,
                cidade: formData.city,
                estado: formData.state,
                complemento: formData.complement,
            },
            itens: enrichedItems,
            subtotal: itemsSubtotal,
            frete: actualShippingCost,
            desconto: couponDiscount,
            total: finalTotal,
            metodo_pagamento: formData.paymentMethod, // Temporário, será atualizado pelo Brick
            cupom: couponCode || undefined,
            tipo_entrega: shippingMethod,
        });

        setOrderCreated(order);
        setDataConfirmed(true);
        toast.success("Dados confirmados! Escolha a forma de pagamento.");
    } catch (err: any) {
        toast.error("Erro ao processar dados: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const itemsSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const actualShippingCost = shippingMethod === "entrega" ? shippingCost : 0;
  const finalTotal = Number((itemsSubtotal + actualShippingCost - couponDiscount).toFixed(2));

  // Tela de sucesso animada - VERSÃO LIGHT
  if (showSuccessScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-white via-cyan-50 to-blue-50 z-50 flex items-center justify-center overflow-hidden">
        {/* Animação de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 text-center px-4 animate-fade-in">
          {/* Ícone de sucesso com animação */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-24 h-24">
              {/* Círculo externo */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-spin" style={{ animationDuration: "3s" }} />

              {/* Círculo branco */}
              <div className="absolute inset-1 rounded-full bg-white shadow-xl" />

              {/* Checkmark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Check className="w-12 h-12 text-cyan-600 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Texto */}
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Pedido Confirmado! 🎉
          </h1>

          <p className="text-xl text-cyan-700 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Seu pedido foi finalizado com sucesso
          </p>

          {/* Detalhes */}
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-cyan-100 p-8 mb-8 max-w-md mx-auto animate-fade-in shadow-2xl" style={{ animationDelay: "0.6s" }}>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-semibold">Email de confirmação enviado</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-semibold">Pedido aprovado para processamento</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Check className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-semibold">Rastreie seu status em nossa plataforma</span>
              </div>
            </div>
          </div>

          {/* Contador automático */}
          <p className="text-cyan-600 font-bold text-sm animate-fade-in" style={{ animationDelay: "0.8s" }}>
            ⏱️ Redirecionando em alguns segundos...
          </p>
        </div>

        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/30 to-gray-50 flex flex-col">
      <Header />


      <main className="flex-1 pt-36 md:pt-40 pb-20 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Premium */}
          <div className="mb-12 animate-fade-in">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold mb-6 transition-all group hover:gap-3"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
              Voltar ao Carrinho
            </button>

            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-cyan-600 to-blue-800 bg-clip-text text-transparent drop-shadow-sm leading-tight">
                  Finalizar Compra
                </h1>
                <p className="text-gray-700 font-medium text-lg">Você está a um passo de receber seu pedido! ✨</p>
              </div>

              {/* Progress Bars */}
              <div className="flex gap-2 max-w-xs">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${step <= 1
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500"
                      : "bg-gray-300"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center space-y-6 animate-bounce-slow">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl flex items-center justify-center border-2 border-cyan-200/50 backdrop-blur-xl">
                  <Heart className="w-16 h-16 text-cyan-600 animate-pulse" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-2xl mb-2">Seu carrinho está vazio</p>
                  <p className="text-gray-600 mb-8 text-lg">Explore nossos produtos e adicione itens para começar sua compra</p>
                  <button
                    type="button"
                    onClick={() => navigate("/produtos")}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 via-cyan-700 to-blue-700 hover:from-cyan-700 hover:via-cyan-800 hover:to-blue-800 text-white rounded-full font-bold text-lg transition-all hover:shadow-2xl active:scale-95 shadow-lg"
                  >
                    Explorar Produtos
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-6">
                  {/* 1. Resumo do Carrinho - PREMIUM */}
                  <div className="group bg-gradient-to-br from-white via-cyan-50/20 to-white rounded-3xl p-8 border-2 border-cyan-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-cyan-300/80 animate-fade-in"
                    style={{ animationDelay: "0.1s" }}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl border border-cyan-300/50 backdrop-blur-sm">
                        <Package className="w-8 h-8 text-cyan-600" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900">Seus Itens</h2>
                        <p className="text-gray-600 text-sm font-medium">{items.length} {items.length === 1 ? "item" : "itens"} no carrinho</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {items.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 bg-gradient-to-r from-gray-50/80 via-cyan-50/30 to-transparent rounded-2xl border-2 border-gray-100/50 group/item hover:border-cyan-400/60 hover:bg-cyan-50/50 transition-all duration-300 backdrop-blur-sm hover:shadow-lg relative"
                          style={{ animationDelay: `${idx * 0.05}s` }}>
                          {/* Imagem */}
                          <div className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0 shadow-md relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover/item:scale-125 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-cyan-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                          </div>

                          {/* Detalhes */}
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg group-hover/item:text-cyan-700 transition-colors">{item.name}</h4>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-bold border border-cyan-300/50">
                                  {item.quantity}x
                                </span>
                                <span className="text-gray-600 font-semibold">{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                            <p className="text-cyan-600 font-black text-xl sm:text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mt-2 sm:mt-0">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-3 hover:bg-red-100/80 rounded-xl transition-all text-gray-400 hover:text-red-600 hover:scale-110 active:scale-95 backdrop-blur-sm"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Dados do Cliente - PREMIUM */}
                  <div className="group bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl p-8 border-2 border-blue-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-300/80 animate-fade-in"
                    style={{ animationDelay: "0.15s" }}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-300/50 backdrop-blur-sm">
                        <AlertCircle className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Seus Dados</h2>
                    </div>

                    {/* Aviso de usuário logado */}
                    {user && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl flex items-start gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg mt-1">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-green-900">Você está logado!</p>
                          <p className="text-sm text-green-800 mt-1">
                            Seus dados foram carregados automaticamente. Se ainda não preencheu seu perfil, complete as informações abaixo.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-3 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">1</span>
                            Nome Completo *
                          </label>
                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder=""
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.name ? "border-red-400 bg-red-50/50" : "border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:bg-blue-50/50"}`}
                          />
                          {errors.name && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.name}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">2</span>
                            Email *
                            {user && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Verificado</span>}
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => !user && setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder=""
                            readOnly={user ? true : false}
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${user
                              ? "border-green-300 bg-green-50/50 cursor-not-allowed"
                              : errors.email ? "border-red-400 bg-red-50/50" : "border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:bg-blue-50/50"
                              }`}
                          />
                          {user && (
                            <p className="text-xs text-green-600 font-semibold">Email não pode ser alterado (verificado no cadastro)</p>
                          )}
                          {errors.email && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.email}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">3</span>
                            Telefone *
                          </label>
                          <Input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            placeholder=""
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.phone ? "border-red-400 bg-red-50/50" : "border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:bg-blue-50/50"}`}
                          />
                          {errors.phone && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.phone}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">4</span>
                            Ano do Veículo *
                          </label>
                          <Input
                            type="text"
                            value={formData.anoVeiculo}
                            onChange={(e) => setFormData(prev => ({ ...prev, anoVeiculo: e.target.value.replace(/\D/g, "") }))}
                            placeholder="Ex: 2015"
                            maxLength={4}
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.anoVeiculo ? "border-red-400 bg-red-50/50" : "border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:bg-blue-50/50"}`}
                          />
                          {errors.anoVeiculo && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.anoVeiculo}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black">5</span>
                          CPF/CNPJ *
                        </label>
                        <Input
                          type="text"
                          value={formData.cpfCnpj}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            setFormData((prev) => ({ ...prev, cpfCnpj: value }));
                          }}
                          placeholder="000.000.000-00 ou 00.000.000/0000-00"
                          className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.cpfCnpj ? "border-red-400 bg-red-50/50" : "border-blue-200 bg-blue-50/30 focus:border-blue-500 focus:bg-blue-50/50"}`}
                        />
                        {errors.cpfCnpj && (
                          <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cpfCnpj}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Endereço - PREMIUM */}
                  <div className="group bg-gradient-to-br from-white via-purple-50/20 to-white rounded-3xl p-8 border-2 border-purple-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-purple-300/80 animate-fade-in"
                    style={{ animationDelay: "0.2s" }}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-300/50 backdrop-blur-sm">
                        <MapPin className="w-8 h-8 text-purple-600" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Método de Entrega</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <button
                        type="button"
                        onClick={() => setShippingMethod("entrega")}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${shippingMethod === "entrega"
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/10"
                          }`}
                      >
                        <Truck className={`w-8 h-8 ${shippingMethod === "entrega" ? "text-purple-600" : "text-gray-400"}`} />
                        <div>
                          <p className={`font-black uppercase text-xs tracking-wider ${shippingMethod === "entrega" ? "text-purple-700" : "text-gray-600"}`}>Entrega via Transportadora</p>
                          <p className="text-sm text-gray-500 font-medium">Enviamos para todo Brasil</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingMethod("retirada")}
                        className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${shippingMethod === "retirada"
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/10"
                          }`}
                      >
                        <MapPin className={`w-8 h-8 ${shippingMethod === "retirada" ? "text-purple-600" : "text-gray-400"}`} />
                        <div>
                          <p className={`font-black uppercase text-xs tracking-wider ${shippingMethod === "retirada" ? "text-purple-700" : "text-gray-600"}`}>Retirada na Empresa</p>
                          <p className="text-sm text-gray-500 font-medium italic">Grátis - Campinas, SP</p>
                        </div>
                      </button>
                    </div>

                    {shippingMethod === "retirada" ? (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-purple-500/10 rounded-xl">
                            <MapPin className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-black text-purple-900 text-lg">Endereço de Retirada:</p>
                            <p className="text-gray-700 font-medium leading-relaxed">
                              R. Dr. Élton César, 910<br />
                              Chácaras Campos dos Amarais - Campinas, SP<br />
                              CEP: 13082-025<br />
                              <span className="text-purple-700 font-bold">Horário: Seg a Sex 07:00 às 16:00</span>
                            </p>
                            <div className="mt-4 p-3 bg-green-100/50 border border-green-200 rounded-xl">
                              <p className="text-green-700 text-sm font-bold flex items-center gap-2">
                                <Check className="w-4 h-4" />
                                Seu pedido estará pronto em 1 dia útil após a aprovação!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-5">
                      {/* CEP Input */}
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                          CEP * <span className="text-purple-600">Buscar</span>
                        </label>
                        <div className="flex gap-3">
                          <Input
                            type="text"
                            value={formData.cep}
                            onChange={(e) => {
                              const cleaned = e.target.value.replace(/\D/g, "");
                              setFormData((prev) => ({ ...prev, cep: cleaned }));
                              if (cleaned.length === 8) {
                                handleCepChange(cleaned);
                              }
                            }}
                            placeholder=""
                            maxLength={8}
                            disabled={cepLoading}
                            className={`flex-1 px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold disabled:opacity-60 ${errors.cep || cepError ? "border-red-400 bg-red-50/50" : "border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50"}`}
                          />
                        </div>
                        {cepLoading && (
                          <div className="flex items-center gap-2 text-purple-600 font-bold">
                            <Loader className="w-5 h-5 animate-spin" />
                            Buscando endereço...
                          </div>
                        )}
                        {cepError && (
                          <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {cepError}
                          </span>
                        )}
                        {errors.cep && (
                          <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.cep}
                          </span>
                        )}
                        {formData.state && shippingTime && !cepError && (
                          <div className="mt-4 p-5 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl text-sm backdrop-blur-sm">
                            <p className="text-green-700 font-black flex items-center gap-2 text-lg mb-2">
                              <Check className="w-6 h-6" />
                              Entrega em {shippingTime}
                            </p>
                            <p className="text-green-600 font-bold">Frete: {formatCurrency(shippingCost)}</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2 space-y-2">
                          <label className="block text-sm font-bold text-gray-700">Rua *</label>
                          <Input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
                            placeholder=""
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.street ? "border-red-400 bg-red-50/50" : "border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50"}`}
                          />
                          {errors.street && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.street}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700">Bairro *</label>
                          <Input
                            type="text"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData((prev) => ({ ...prev, neighborhood: e.target.value }))}
                            placeholder=""
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.neighborhood ? "border-red-400 bg-red-50/50" : "border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50"}`}
                          />
                          {errors.neighborhood && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.neighborhood}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700">Número *</label>
                          <Input
                            type="text"
                            value={formData.number}
                            onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))}
                            placeholder=""
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.number ? "border-red-400 bg-red-50/50" : "border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50"}`}
                          />
                          {errors.number && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.number}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Complemento (Apto, Bloco, etc)</label>
                        <Input
                          type="text"
                          value={formData.complement}
                          onChange={(e) => setFormData((prev) => ({ ...prev, complement: e.target.value }))}
                          placeholder=""
                          className="w-full px-5 py-4 rounded-2xl border-2 border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50 transition-all backdrop-blur-sm font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700">Cidade *</label>
                          <Input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                            placeholder=""
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.city ? "border-red-400 bg-red-50/50" : "border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50"}`}
                          />
                          {errors.city && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.city}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-gray-700">Estado *</label>
                          <Input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value.toUpperCase() }))}
                            placeholder=""
                            maxLength={2}
                            className={`w-full px-5 py-4 rounded-2xl border-2 transition-all backdrop-blur-sm font-semibold ${errors.state ? "border-red-400 bg-red-50/50" : "border-purple-200 bg-purple-50/30 focus:border-purple-500 focus:bg-purple-50/50"}`}
                          />
                          {errors.state && (
                            <span className="text-red-600 text-sm font-bold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {errors.state}
                            </span>
                          )}
                        </div>
                        </div>
                      </div>
                    )}
                  </div>

                    {/* 4. Pagamento - PREMIUM */}
                    <div className="group bg-gradient-to-br from-white via-amber-50/20 to-white rounded-3xl p-8 border-2 border-amber-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-amber-300/80"
                      style={{ animationDelay: "0.25s" }}>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-300/50 backdrop-blur-sm">
                          <Lock className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Pagamento Seguro</h2>
                      </div>

                      {!dataConfirmed ? (
                        <div className="space-y-6">
                            <div className="p-6 bg-amber-50 rounded-2xl border-2 border-amber-100 flex items-start gap-3">
                                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <p className="text-amber-800 font-medium">
                                    Preencha todos os campos acima (contato, ano do veículo e endereço) para liberar as opções de pagamento.
                                </p>
                            </div>
                            <button
                                onClick={handleConfirmData}
                                disabled={loading}
                                className="w-full py-5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xl rounded-2xl transition-all active:scale-95 shadow-lg border-b-4 border-orange-800 disabled:opacity-50"
                            >
                                {loading ? "Processando..." : "Confirmar Dados e Ir para Pagamento"}
                            </button>
                        </div>
                      ) : (
                        <div key={`payment-container-${orderCreated?.id}`} className="p-4 bg-white rounded-3xl border-2 border-amber-200/50 shadow-inner w-full overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
                          <MercadoPagoPayment
                            amount={finalTotal}
                            description={`Pedido Automatiza - ${items.length} itens`}
                            externalReference={orderCreated?.id}
                            payerEmail={formData.email || "cliente@automatiza.com.br"}
                            onPaymentSuccess={(paymentData) => {
                              console.log("Payment success data:", paymentData);
                              if (paymentData.payment_method_id === "pix") {
                                toast.success("QR Code PIX gerado!");
                                navigate(`/pix-payment/${orderCreated.id}`);
                              } else {
                                toast.success("Pagamento aprovado! 🎉");
                                setShowSuccessScreen(true);
                              }
                            }}
                            onPaymentError={(err) => {
                              console.error("Payment failed:", err);
                              toast.error(typeof err === "string" ? err : "O pagamento não pôde ser processado.");
                            }}
                          />
                        </div>
                      )}
                    </div>

                  {/* 5. Cupom de Desconto - PREMIUM */}
                  <div className="group bg-gradient-to-br from-white via-green-50/20 to-white rounded-3xl p-8 border-2 border-green-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-300/80 animate-fade-in"
                    style={{ animationDelay: "0.35s" }}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-300/50 backdrop-blur-sm">
                        <Gift className="w-8 h-8 text-green-600" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900">Cupom de Desconto</h2>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponMessage("");
                          }}
                          onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                          placeholder="Digite o código do cupom"
                          disabled={couponApplied}
                          className="flex-1 px-5 py-4 rounded-2xl border-2 border-green-200 bg-green-50/30 focus:border-green-500 focus:bg-green-50/50 transition-all backdrop-blur-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {!couponApplied ? (
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl transition-all active:scale-95 hover:shadow-lg shadow-md border border-green-400/50 flex items-center gap-2"
                          >
                            <Zap className="w-5 h-5" />
                            Aplicar
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-2xl transition-all active:scale-95 hover:shadow-lg shadow-md border border-red-400/50 flex items-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            Remover
                          </button>
                        )}
                      </div>

                      {couponMessage && (
                        <div className={`p-4 rounded-2xl border-2 font-bold flex items-center gap-3 ${couponApplied
                          ? "bg-green-50/80 border-green-300/50 text-green-700"
                          : "bg-red-50/80 border-red-300/50 text-red-700"
                          }`}>
                          {couponApplied ? (
                            <Check className="w-5 h-5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          )}
                          {couponMessage}
                        </div>
                      )}

                      {couponApplied && couponDiscount > 0 && (
                        <div className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 border-2 border-green-300/50 rounded-2xl p-4 text-center">
                          <p className="text-sm text-gray-700 font-semibold mb-2">Desconto Aplicado</p>
                          <p className="text-3xl font-black text-green-600">{formatCurrency(couponDiscount)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* O botão de finalizar agora é controlado pelo Mercado Pago Brick */}
                  <div className="p-4 text-center text-gray-500 text-sm font-medium">
                    <Lock className="w-4 h-4 inline-block mr-1" />
                    Pagamento processado com segurança pelo Mercado Pago
                  </div>
                </div>
              </div>

              {/* Resumo Lateral - PREMIUM */}
              <div className="lg:col-span-1">
                <div className="rounded-3xl sticky top-40 space-y-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  {/* Cartão Principal */}
                  <div className="bg-gradient-to-br from-white via-cyan-50/20 to-white rounded-3xl p-8 border-2 border-cyan-300/50 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300">
                    <h3 className="text-3xl font-black text-gray-900 mb-8">Resumo Final</h3>

                    <div className="space-y-6 border-t-2 border-gray-200 pt-6">
                      <div className="flex justify-between items-end">
                        <span className="text-gray-700 font-bold text-lg">Subtotal</span>
                        <span className="font-black text-gray-900 text-2xl">{formatCurrency(itemsSubtotal)}</span>
                      </div>

                      {shippingMethod === "entrega" && shippingCost > 0 && (
                        <div className="flex justify-between items-end">
                          <span className="text-gray-700 font-bold text-lg flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            Frete
                          </span>
                          <span className="font-black text-gray-900 text-2xl">{formatCurrency(shippingCost)}</span>
                        </div>
                      )}

                      {shippingMethod === "retirada" && (
                        <div className="flex justify-between items-end">
                          <span className="text-green-600 font-bold text-lg flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            Retirada
                          </span>
                          <span className="font-black text-green-600 text-2xl">Grátis</span>
                        </div>
                      )}

                      {couponDiscount > 0 && (
                        <div className="flex justify-between items-end text-green-600">
                          <span className="font-bold text-lg flex items-center gap-2">
                            <Gift className="w-5 h-5" />
                            Desconto
                          </span>
                          <span className="font-black text-2xl">-{formatCurrency(couponDiscount)}</span>
                        </div>
                      )}

                      <div className="border-t-2 border-gray-200 pt-6 flex justify-between items-end">
                        <span className="font-black text-gray-900 text-xl">Total a Pagar</span>
                        <div className="space-y-1 text-right">
                          <span className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {formatCurrency(finalTotal)}
                          </span>
                          <p className="text-xs font-bold text-cyan-600">em até 12x sem juros</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Segurança */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border-2 border-green-300/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="p-3 bg-green-500/20 rounded-2xl flex-shrink-0">
                        <Shield className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <p className="font-black text-green-900 text-lg mb-2">Compra 100% Segura</p>
                        <p className="text-green-700 font-semibold text-sm">Seus dados estão protegidos com criptografia SSL de 256 bits</p>
                      </div>
                    </div>
                  </div>

                  {/* Entrega */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border-2 border-blue-300/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-2xl flex-shrink-0">
                        <Truck className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-black text-blue-900 text-lg mb-2">Entrega Rápida</p>
                        <p className="text-blue-700 font-semibold text-sm">Entregamos em todo Brasil com rastreamento em tempo real</p>
                      </div>
                    </div>
                  </div>

                  {/* Garantia */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-2 border-purple-300/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-2xl flex-shrink-0">
                        <Check className="w-8 h-8 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-black text-purple-900 text-lg mb-2">Garantia Completa</p>
                        <p className="text-purple-700 font-semibold text-sm">Devoluções e trocas em até 30 dias sem complicações</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
