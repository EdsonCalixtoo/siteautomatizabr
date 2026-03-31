import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Package, Clock, CheckCircle2, Truck, AlertCircle, ArrowLeft, Search, Mail, Receipt, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
        if (!id || !emailStr) return;
        
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from("pedidos")
                .select("*")
                .eq("id", id)
                .ilike("cliente_email", emailStr.trim())
                .single();

            if (error || !data) {
                setError("Pedido não encontrado ou e-mail incorreto.");
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
        if (orderId && email) {
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
                return { label: "Aguardando Pagamento", icon: Clock, color: "text-amber-500", bg: "bg-amber-100", step: 1 };
            case "pago":
                return { label: "Pagamento Aprovado", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100", step: 2 };
            case "confirmado":
                return { label: "Em Produção", icon: Receipt, color: "text-blue-500", bg: "bg-blue-100", step: 2 };
            case "enviado":
                return { label: "Enviado", icon: Truck, color: "text-purple-500", bg: "bg-purple-100", step: 3 };
            case "entregue":
                return { label: "Entregue", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", step: 4 };
            case "cancelado":
                return { label: "Cancelado", icon: AlertCircle, color: "text-red-500", bg: "bg-red-100", step: 0 };
            default:
                return { label: status, icon: Package, color: "text-gray-500", bg: "bg-gray-100", step: 1 };
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            
            <main className="flex-1 pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-bold mb-8 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                        Voltar para Início
                    </Link>

                    {!order && (
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="max-w-md mx-auto text-center space-y-6">
                                <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-10 h-10 text-cyan-600" />
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Rastrear seu Pedido</h1>
                                <p className="text-slate-600 font-medium">Insira os dados abaixo para ver o status da sua entrega em tempo real.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="ID do Pedido (Ex: #8a2f...)" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 focus:outline-none font-bold transition-all"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value.replace("#", ""))}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="email" 
                                            placeholder="Seu e-mail" 
                                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-cyan-500 focus:outline-none font-bold transition-all"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-cyan-600/20 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {loading ? "Buscando..." : "Ver Status agora"}
                                    </button>
                                </form>

                                {error && (
                                    <div className="p-4 bg-red-50 border-2 border-red-100 rounded-xl text-red-600 font-bold flex items-center gap-2 animate-pulse">
                                        <AlertCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {order && (
                        <div className="space-y-8 animate-in fade-in duration-700">
                            {/* Status Header */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-black uppercase text-xs tracking-widest ${getStatusInfo(order.status).bg} ${getStatusInfo(order.status).color}`}>
                                    {getStatusInfo(order.status).label}
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className={`w-24 h-24 rounded-3xl ${getStatusInfo(order.status).bg} flex items-center justify-center shrink-0`}>
                                        {(() => {
                                            const Icon = getStatusInfo(order.status).icon;
                                            return <Icon className={`w-12 h-12 ${getStatusInfo(order.status).color}`} />;
                                        })()}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-2">Status da sua Compra</p>
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none mb-4">
                                            {getStatusInfo(order.status).label}! ✨
                                        </h1>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">
                                                <Receipt className="w-4 h-4" />
                                                #{order.id.slice(0, 8)}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(order.data_criacao).toLocaleDateString("pt-BR")}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Steps */}
                                <div className="mt-12 relative">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                                            style={{ width: `${(getStatusInfo(order.status).step / 4) * 100}%` }}
                                        />
                                    </div>
                                    <div className="relative flex justify-between">
                                        {[
                                            { label: "Recebido", step: 1, icon: Receipt },
                                            { label: "Pago", step: 2, icon: CheckCircle2 },
                                            { label: "Enviado", step: 3, icon: Truck },
                                            { label: "Entregue", step: 4, icon: Package }
                                        ].map((s) => (
                                            <div key={s.step} className="flex flex-col items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 ${
                                                    getStatusInfo(order.status).step >= s.step 
                                                    ? "bg-white border-cyan-500 text-cyan-500 scale-110 shadow-lg shadow-cyan-200" 
                                                    : "bg-slate-100 border-slate-200 text-slate-400"
                                                }`}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <span className={`text-xs font-black uppercase tracking-wider ${getStatusInfo(order.status).step >= s.step ? "text-cyan-600" : "text-slate-400"}`}>
                                                    {s.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Itens */}
                                <div className="md:col-span-2 space-y-4">
                                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
                                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                                            <Package className="w-6 h-6 text-cyan-600" />
                                            Produtos no Pedido
                                        </h3>
                                        <div className="space-y-4">
                                            {order.itens.map((item: any, idx: number) => (
                                                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-cyan-200 transition-colors group">
                                                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 flex-shrink-0 flex items-center justify-center font-black text-cyan-600 overflow-hidden shadow-sm">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform" />
                                                        ) : (
                                                            <Package className="w-8 h-8 opacity-20" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{item.name}</h4>
                                                        <p className="text-sm text-slate-500 font-bold">{item.quantity}x • {formatCurrency(item.price)}/un</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-black text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sumário */}
                                <div className="space-y-4">
                                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 h-full">
                                        <h3 className="text-xl font-black text-slate-900 mb-6">Resumo Financeiro</h3>
                                        <div className="space-y-4 text-sm font-bold">
                                            <div className="flex justify-between text-slate-500">
                                                <span>Total do Pedido</span>
                                                <span className="text-slate-900">{formatCurrency(order.total)}</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500">
                                                <span>Frete</span>
                                                <span className="text-emerald-600">Grátis</span>
                                            </div>
                                            <div className="flex justify-between text-slate-500 pt-4 border-t border-slate-100">
                                                <span className="text-lg font-black text-slate-900">VALOR PAGO</span>
                                                <span className="text-lg font-black text-cyan-600">{formatCurrency(order.total)}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 p-4 bg-cyan-50 rounded-2xl border border-cyan-100">
                                            <p className="text-xs text-cyan-700 font-bold mb-1 uppercase tracking-widest">Atenção</p>
                                            <p className="text-xs text-cyan-600 font-medium leading-relaxed">
                                                Seu pedido já está com nosso time de logística. Em breve você receberá o código de rastreio em seu e-mail.
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => { setOrder(null); setOrderId(""); setEmail(""); }}
                                            className="w-full mt-6 py-3 border-2 border-slate-100 text-slate-400 hover:text-slate-600 hover:border-slate-200 rounded-xl font-bold text-sm transition-all"
                                        >
                                            Consultar outro código
                                        </button>
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
