import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Package, Clock, CheckCircle2, Factory, Truck, AlertCircle, ArrowLeft, Search, Mail, Receipt, Calendar, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
    id: string;
    status: string;
    cliente_nome: string;
    cliente_email: string;
    total: number;
    itens: any[];
    data_criacao: string;
    tipo_entrega: string;
}

export default function TrackOrder() {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get("id") || "");
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrder = async (id: string, emailStr: string) => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        try {
            let query = supabase.from("pedidos").select("*").eq("id", id);
            
            if (emailStr) {
                query = query.ilike("cliente_email", emailStr.trim());
            }

            const { data, error } = await query.single();

            if (error || !data) {
                setError("Pedido não encontrado. Verifique os dados informados.");
                setOrder(null);
            } else {
                setOrder(data);
            }
        } catch (err) {
            setError("Ocorreu um erro ao buscar o pedido.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-fetch se o ID vier na URL
        if (orderId) {
            fetchOrder(orderId, email);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchOrder(orderId, email);
    };

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "aguardando_pagamento":
            case "pendente":
                return { 
                    label: "Aguardando Pagamento", 
                    icon: CreditCard, 
                    color: "text-amber-500", 
                    bg: "bg-amber-50", 
                    border: "border-amber-200",
                    step: 1,
                    desc: "Recebemos seu pedido e estamos aguardando a confirmação do pagamento."
                };
            case "pagamento_aprovado":
            case "pago":
                return { 
                    label: "Pagamento Aprovado", 
                    icon: CheckCircle2, 
                    color: "text-emerald-500", 
                    bg: "bg-emerald-50", 
                    border: "border-emerald-200",
                    step: 2,
                    desc: "Tudo certo! Seu pagamento foi confirmado e seu pedido está pronto para a próxima fase."
                };
            case "em_fabricacao":
            case "confirmado":
                return { 
                    label: "Pedido em Fabricação", 
                    icon: Factory, 
                    color: "text-blue-500", 
                    bg: "bg-blue-50", 
                    border: "border-blue-200",
                    step: 3,
                    desc: "Nosso time de produção já iniciou a fabricação dos seus produtos."
                };
            case "retirado_fabrica":
            case "enviado":
            case "entregue":
                return { 
                    label: "Pedido Retirado da Fábrica", 
                    icon: Package, 
                    color: "text-indigo-600", 
                    bg: "bg-indigo-50", 
                    border: "border-indigo-200",
                    step: 4,
                    desc: "Seu pedido foi finalizado e já saiu da nossa fábrica!"
                };
            case "cancelado":
                return { 
                    label: "Cancelado", 
                    icon: AlertCircle, 
                    color: "text-red-500", 
                    bg: "bg-red-50", 
                    border: "border-red-200",
                    step: 0,
                    desc: "Este pedido foi cancelado. Entre em contato para mais informações."
                };
            default:
                return { label: status, icon: Package, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200", step: 1, desc: "" };
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFF] flex flex-col font-sans">
            <Header />
            
            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-600 font-semibold mb-8 transition-all group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Voltar para a loja
                        </Link>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {!order ? (
                            <motion.div 
                                key="search"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-[2rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100"
                            >
                                <div className="max-w-sm mx-auto text-center space-y-8">
                                    <div className="w-20 h-20 bg-cyan-50 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-cyan-50/50">
                                        <Search className="w-10 h-10 text-cyan-600" />
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rastrear seu Pedido</h1>
                                        <p className="text-slate-500 font-medium">Acompanhe cada etapa da sua fabricação</p>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                        <div className="relative group">
                                            <Receipt className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-cyan-500 transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="ID do Pedido" 
                                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-cyan-500 focus:outline-none font-bold transition-all placeholder:text-slate-300"
                                                value={orderId}
                                                onChange={(e) => setOrderId(e.target.value.replace("#", ""))}
                                                required
                                            />
                                        </div>
                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 hover:bg-cyan-600 active:scale-[0.98] transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Buscando..." : "Consultar Status"}
                                        </button>
                                    </form>

                                    {error && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 font-semibold flex items-center gap-2"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                            {error}
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="order"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                {/* Banner de Status */}
                                <div className={`bg-white rounded-[2rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border ${getStatusInfo(order.status).border} relative overflow-hidden backdrop-blur-sm`}>
                                    <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
                                        <div className={`w-24 h-24 rounded-3xl ${getStatusInfo(order.status).bg} flex items-center justify-center shrink-0 shadow-inner`}>
                                            {(() => {
                                                const Icon = getStatusInfo(order.status).icon;
                                                return <Icon className={`w-12 h-12 ${getStatusInfo(order.status).color}`} />;
                                            })()}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusInfo(order.status).bg} ${getStatusInfo(order.status).color}`}>
                                                {getStatusInfo(order.status).label}
                                            </span>
                                            <h1 className="text-3xl font-black text-slate-900 leading-tight">
                                                {getStatusInfo(order.status).label}!
                                            </h1>
                                            <p className="text-slate-500 font-medium leading-relaxed max-w-lg">
                                                {getStatusInfo(order.status).desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Timeline */}
                                    <div className="mt-16 relative px-4">
                                        <div className="absolute top-5 left-0 w-full h-[6px] bg-slate-50 rounded-full">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((getStatusInfo(order.status).step - 1) / 3) * 100}%` }}
                                                className="h-full bg-cyan-500 rounded-full"
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </div>
                                        <div className="relative flex justify-between">
                                            {[
                                                { label: "Aguardando", step: 1, icon: CreditCard },
                                                { label: "Aprovado", step: 2, icon: CheckCircle2 },
                                                { label: "Fabricação", step: 3, icon: Factory },
                                                { label: "Retirado", step: 4, icon: Package }
                                            ].map((s) => (
                                                <div key={s.step} className="flex flex-col items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-700 z-10 ${
                                                        getStatusInfo(order.status).step >= s.step 
                                                        ? "bg-white border-cyan-500 text-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] scale-110" 
                                                        : "bg-slate-100 border-white text-slate-300"
                                                    }`}>
                                                        <s.icon className={`${getStatusInfo(order.status).step >= s.step ? "w-5 h-5" : "w-4 h-4"}`} />
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter sm:tracking-widest ${getStatusInfo(order.status).step >= s.step ? "text-slate-900" : "text-slate-300"}`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Seção de Detalhes */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-50">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                                            <Package className="w-5 h-5 text-cyan-500" />
                                            Itens no Pedido
                                        </h3>
                                        <div className="space-y-4">
                                            {order.itens.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-0">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-slate-400 overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="w-6 h-6 opacity-20" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                                                        <p className="text-xs text-slate-400 font-bold">{item.quantity} unidade(s)</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl text-white flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <div className="space-y-1">
                                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Número do Pedido</p>
                                                    <p className="font-bold text-lg">#{order.id.slice(0, 8)}</p>
                                                </div>
                                                <Receipt className="w-8 h-8 text-slate-700" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Final</p>
                                                <p className="font-black text-3xl text-cyan-400">{formatCurrency(order.total)}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-10 p-4 bg-slate-800/50 rounded-2xl border border-slate-800">
                                            <p className="text-xs text-slate-300 leading-relaxed">
                                                Seu código de rastreio de transportadora será atualizado assim que o pedido for finalizado.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center pt-8">
                                    <button 
                                        onClick={() => { setOrder(null); setOrderId(""); setEmail(""); }}
                                        className="text-slate-400 hover:text-slate-900 font-bold text-sm transition-all"
                                    >
                                        Consultar outro código
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}
