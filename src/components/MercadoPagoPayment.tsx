import { useEffect, useRef, useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { supabase } from "@/lib/supabase";
import { CreditCard, Loader, AlertCircle } from "lucide-react";

interface MercadoPagoPaymentProps {
    amount: number;
    description: string;
    externalReference: string;
    payerEmail: string;
    onPaymentSuccess: (data: any) => void;
    onPaymentError: (error: any) => void;
}

declare global {
    interface Window {
        MercadoPago: any;
    }
}

// Incrementei a inicialização usando a lib oficial para evitar erros de SSL manual
export function MercadoPagoPayment({
    amount,
    description,
    externalReference,
    payerEmail,
    onPaymentSuccess,
    onPaymentError,
}: MercadoPagoPaymentProps) {
    const [tab, setTab] = useState<"credit_card" | "pix">("pix");
    const [mpReady, setMpReady] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);
    const [pixError, setPixError] = useState<string | null>(null);
    const mpRef = useRef<any>(null);
    const cardFormRef = useRef<any>(null);
    const cardFormMountedRef = useRef(false);

    useEffect(() => {
        const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
        if (!publicKey) {
            console.error("VITE_MERCADO_PAGO_PUBLIC_KEY não configurado");
            return;
        }

        try {
            // Usa o método oficial da biblioteca instalada
            initMercadoPago(publicKey, { locale: "pt-BR" });
            
            // Em vez de injetar o script, usamos a referência global que a lib cria
            const iv = setInterval(() => {
                if (window.MercadoPago) {
                    clearInterval(iv);
                    if (!mpRef.current) {
                        mpRef.current = new window.MercadoPago(publicKey, { locale: "pt-BR" });
                    }
                    setMpReady(true);
                }
            }, 200);
            return () => clearInterval(iv);
        } catch (err) {
            console.error("Erro ao inicializar MP SDK:", err);
        }
    }, []);

    // ── Mount CardForm only when Credit Card tab is active ──────
    useEffect(() => {
        if (!mpReady || tab !== "credit_card") return;

        const timer = setTimeout(() => {
            // Cleanup previous instance if any
            if (cardFormMountedRef.current && cardFormRef.current) {
                try { cardFormRef.current.unmount(); } catch (_) { }
                cardFormMountedRef.current = false;
                cardFormRef.current = null;
            }

            cardFormRef.current = mpRef.current.cardForm({
                amount: String(amount),
                iframe: true,
                form: {
                    id: "mp-card-form",
                    cardNumber: { id: "mp-card-number", placeholder: "0000 0000 0000 0000" },
                    expirationDate: { id: "mp-card-expiry", placeholder: "MM/AA" },
                    securityCode: { id: "mp-card-cvv", placeholder: "CVV" },
                    cardholderName: { id: "mp-card-name", placeholder: "Nome como no cartão" },
                    identificationType: { id: "mp-card-doctype" },
                    identificationNumber: { id: "mp-card-docnum", placeholder: "000.000.000-00" },
                    cardholderEmail: { id: "mp-card-email" },
                    issuer: { id: "mp-card-issuer" },
                    installments: { id: "mp-card-installments" },
                },
                callbacks: {
                    onFormMounted: (err: any) => {
                        if (err) { console.error("CardForm mount error:", err); return; }
                        cardFormMountedRef.current = true;
                    },
                    onCardTokenReceived: async (err: any, token: string) => {
                        if (err || !token) {
                            setCardError("Verifique os dados do cartão e tente novamente.");
                            setLoading(false);
                            return;
                        }
                        const { paymentMethodId } = cardFormRef.current.getCardFormData();
                        await submitPayment("credit_card", token, paymentMethodId);
                    },
                    onError: (err: any) => console.error("CardForm error:", err),
                },
            });
        }, 400);

        return () => {
            clearTimeout(timer);
            if (cardFormMountedRef.current && cardFormRef.current) {
                try { cardFormRef.current.unmount(); } catch (_) { }
                cardFormMountedRef.current = false;
                cardFormRef.current = null;
            }
        };
    }, [mpReady, tab]);

    // ── Payment submission ──────────────────────────────────────
    const submitPayment = async (
        type: "pix" | "credit_card",
        token?: string,
        paymentMethodId?: string
    ) => {
        try {
            console.log("Submitting payment:", { type, amount, payerEmail });

            const installments =
                type === "credit_card"
                    ? Number((document.getElementById("mp-card-installments") as HTMLSelectElement)?.value || 1)
                    : 1;

            // 1. Atualizar o método de pagamento no banco antes de processar
            await supabase
                .from("pedidos")
                .update({ metodo_pagamento: type === "pix" ? "pix" : "cartao" })
                .eq("id", externalReference);

            // 2. Chamar a função de pagamento
            const { data, error } = await supabase.functions.invoke("mercadopago-payment", {
                body: {
                    payment_type: type,
                    transaction_amount: amount,
                    payer_email: payerEmail || "cliente@automatiza.com.br",
                    description,
                    external_reference: externalReference,
                    ...(type === "credit_card" && { token, installments, payment_method_id: paymentMethodId }),
                },
            });

            console.log("Function response:", { data, error });

            if (error) throw new Error(error.message || JSON.stringify(error));
            if (data?.error) throw new Error(data.error);

            onPaymentSuccess(data);
        } catch (err: any) {
            console.error("Payment submission error:", err);
            const msg = err?.message || "Erro ao processar pagamento. Tente novamente.";
            if (type === "pix") setPixError(msg);
            else setCardError(msg);
            onPaymentError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setCardError(null);
        if (!cardFormMountedRef.current || !cardFormRef.current) {
            setCardError("Formulário não carregado. Aguarde alguns segundos e tente novamente.");
            return;
        }
        setLoading(true);
        cardFormRef.current.createCardToken();
    };

    const handlePixSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPixError(null);
        setLoading(true);
        await submitPayment("pix");
    };

    if (!mpReady) {
        return (
            <div className="flex items-center justify-center py-10 gap-3 text-amber-600 font-bold">
                <Loader className="w-5 h-5 animate-spin" />
                Carregando formulário seguro...
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* ── Tabs ── */}
            <div className="flex gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => { setTab("pix"); setPixError(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 ${tab === "pix"
                            ? "bg-green-500 text-white border-green-500 shadow-lg"
                            : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                        }`}
                >
                    🔐 PIX
                </button>
                <button
                    type="button"
                    onClick={() => { setTab("credit_card"); setCardError(null); }}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border-2 ${tab === "credit_card"
                            ? "bg-amber-500 text-white border-amber-500 shadow-lg"
                            : "bg-white text-gray-600 border-gray-200 hover:border-amber-300"
                        }`}
                >
                    <CreditCard className="w-4 h-4" />
                    Cartão de Crédito
                </button>
            </div>

            {/* ── PIX Form ── */}
            {tab === "pix" && (
                <form onSubmit={handlePixSubmit} className="space-y-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                        <div className="text-5xl mb-3">🔐</div>
                        <p className="text-green-800 font-bold text-lg">Pagar com PIX</p>
                        <p className="text-green-600 text-sm mt-2">
                            Após clicar, um <strong>QR Code será gerado</strong> instantaneamente.<br />
                            Você terá <strong>5 minutos</strong> para escanear e concluir o pagamento.
                        </p>
                        <div className="mt-4 bg-white rounded-xl border-2 border-green-200 p-3 shadow-inner">
                            <p className="text-xs text-gray-500 font-semibold">Total a pagar</p>
                            <p className="text-3xl font-black text-green-600">
                                {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount)}
                            </p>
                        </div>
                    </div>

                    {pixError && (
                        <div className="flex items-start gap-2 text-red-700 bg-red-50 rounded-xl p-4 border-2 border-red-200 text-sm font-semibold">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Erro ao gerar PIX:</p>
                                <p className="font-normal mt-1">{pixError}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {loading
                            ? <><Loader className="w-5 h-5 animate-spin" /> Gerando QR Code...</>
                            : <>🔐 Gerar QR Code e Pagar</>
                        }
                    </button>
                </form>
            )}

            {/* ── Credit Card Form ── */}
            {tab === "credit_card" && (
                <form id="mp-card-form" onSubmit={handleCardSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Número do Cartão</label>
                        <div id="mp-card-number" className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50 px-3 overflow-hidden" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Validade</label>
                            <div id="mp-card-expiry" className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">CVV</label>
                            <div id="mp-card-cvv" className="h-12 rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Nome no Cartão</label>
                        <input type="text" id="mp-card-name" placeholder="Nome como no cartão"
                            className="w-full h-12 rounded-xl border-2 border-gray-200 bg-gray-50 px-3 text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Documento</label>
                            <select id="mp-card-doctype"
                                className="w-full h-12 rounded-xl border-2 border-gray-200 bg-gray-50 px-3 text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">CPF</label>
                            <input type="text" id="mp-card-docnum" placeholder="000.000.000-00"
                                className="w-full h-12 rounded-xl border-2 border-gray-200 bg-gray-50 px-3 text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Parcelas</label>
                        <select id="mp-card-installments"
                            className="w-full h-12 rounded-xl border-2 border-gray-200 bg-gray-50 px-3 text-sm font-semibold focus:border-amber-400 focus:outline-none" />
                    </div>

                    {/* Hidden fields */}
                    <select id="mp-card-issuer" className="hidden" />
                    <input type="hidden" id="mp-card-email" value={payerEmail} />

                    {cardError && (
                        <div className="flex items-start gap-2 text-red-700 bg-red-50 rounded-xl p-4 border-2 border-red-200 text-sm">
                            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold">Erro no cartão:</p>
                                <p className="font-normal mt-1">{cardError}</p>
                            </div>
                        </div>
                    )}

                    <button type="submit" disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                    >
                        {loading
                            ? <><Loader className="w-5 h-5 animate-spin" /> Processando...</>
                            : <><CreditCard className="w-5 h-5" /> Pagar com Cartão</>
                        }
                    </button>
                    <p className="text-xs text-center text-gray-400">🔒 Dados protegidos pelo Mercado Pago</p>
                </form>
            )}
        </div>
    );
}
