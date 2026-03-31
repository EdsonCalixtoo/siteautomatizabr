import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
    Copy, QrCode, ArrowLeft, CheckCircle,
    Clock, MessageCircle, Loader, XCircle, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { getOrder, updateOrderStatus } from "@/lib/orderService";
import { checkPaymentStatus } from "@/lib/paymentService";

const PIX_EXPIRE_MINUTES = 15;
const POLL_INTERVAL_MS = 10_000;

export default function PixPayment() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "approved" | "failed" | "expired">("pending");
    const [timeLeft, setTimeLeft] = useState(PIX_EXPIRE_MINUTES * 60);

    const pollRef = useRef<any>(null);
    const countdownRef = useRef<any>(null);
    const createdAtRef = useRef<number | null>(null);

    // ── Load order from Supabase ──────────────────────────────
    useEffect(() => {
        if (!orderId) { navigate("/checkout"); return; }

        const loadOrder = async () => {
            try {
                const data = await getOrder(orderId);
                setOrder(data);

                // Calculate time left based on creation time
                const createdAt = new Date(data.data_criacao).getTime();
                createdAtRef.current = createdAt;
                const elapsed = Math.floor((Date.now() - createdAt) / 1000);
                const left = Math.max(0, PIX_EXPIRE_MINUTES * 60 - elapsed);
                setTimeLeft(left);
                if (left === 0) setPaymentStatus("expired");

                // If already paid
                if (data.status === "pago") setPaymentStatus("approved");

            } catch (err: any) {
                setError("Pedido não encontrado. Verifique o link.");
            } finally {
                setLoading(false);
            }
        };
        loadOrder();
    }, [orderId, navigate]);

    // ── Countdown + Polling ───────────────────────────────────
    useEffect(() => {
        if (!order || paymentStatus !== "pending") return;

        // Countdown
        countdownRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - (createdAtRef.current || Date.now())) / 1000);
            const left = Math.max(0, PIX_EXPIRE_MINUTES * 60 - elapsed);
            setTimeLeft(left);
            if (left === 0) {
                clearInterval(countdownRef.current);
                clearInterval(pollRef.current);
                setPaymentStatus("expired");
            }
        }, 1000);

        // Polling payment status
        if (!order.mp_payment_id) return; // No MP payment ID yet

        const poll = async () => {
            try {
                const status = await checkPaymentStatus(order.mp_payment_id);
                if (status === "approved") {
                    clearInterval(pollRef.current);
                    clearInterval(countdownRef.current);
                    await updateOrderStatus(orderId!, "pago");
                    setPaymentStatus("approved");
                    toast.success("Pagamento PIX confirmado! 🎉");
                    setTimeout(() => navigate("/minha-conta"), 3000);
                } else if (status === "rejected" || status === "cancelled") {
                    clearInterval(pollRef.current);
                    clearInterval(countdownRef.current);
                    await updateOrderStatus(orderId!, "cancelado");
                    setPaymentStatus("failed");
                }
            } catch (e) {
                console.error("Polling error:", e);
            }
        };

        // Start polling after 15s
        const startTimer = setTimeout(() => {
            poll();
            pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
        }, 15_000);

        return () => {
            clearTimeout(startTimer);
            clearInterval(pollRef.current);
            clearInterval(countdownRef.current);
        };
    }, [order, orderId, paymentStatus, navigate]);

    const copy = () => {
        if (!order?.pix_code) return;
        navigator.clipboard.writeText(order.pix_code);
        setCopied(true);
        toast.success("Código PIX copiado!");
        setTimeout(() => setCopied(false), 3000);
    };

    const sendWhatsApp = () => {
        const val = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order?.total || 0);
        const msg = encodeURIComponent(
            `🔐 *Pagamento PIX - Automatiza*\n\n💰 Valor: ${val}\n\nCopie o código abaixo e cole no seu banco:\n\n${order?.pix_code}`
        );
        window.open(`https://wa.me/?text=${msg}`, "_blank");
    };

    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    // ── States ────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Erro</h1>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={() => navigate("/checkout")}
                        className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl">
                        Voltar ao Checkout
                    </button>
                </div>
            </div>
        );
    }

    if (paymentStatus === "approved") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-14 h-14 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Pagamento Confirmado! 🎉</h1>
                    <p className="text-gray-500 mb-2">Seu pedido foi aprovado.</p>
                    <p className="text-xs text-gray-400">Redirecionando...</p>
                </div>
            </div>
        );
    }

    if (paymentStatus === "expired" || paymentStatus === "failed") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-14 h-14 text-red-400" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">
                        {paymentStatus === "expired" ? "PIX Expirado" : "Pagamento Não Confirmado"}
                    </h1>
                    <p className="text-gray-500 mb-6">
                        {paymentStatus === "expired" ? "O código PIX expirou." : "Não identificamos o pagamento."}
                    </p>
                    <button onClick={() => navigate("/checkout")}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl">
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    // ── Main PIX screen ───────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
            <Header />
            <main className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border-2 border-green-100 p-8">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <QrCode className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900">Pague com PIX</h1>
                        <p className="text-gray-400 text-sm mt-1">Pedido #{orderId?.slice(0, 8).toUpperCase()}</p>
                    </div>

                    {/* Countdown */}
                    <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl mb-5 font-bold text-sm border-2 transition-colors ${timeLeft < 120 ? "bg-red-50 border-red-200 text-red-600" : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}>
                        <Clock className="w-4 h-4" />
                        {timeLeft > 0 ? `PIX expira em ${fmt(timeLeft)}` : "PIX expirado"}
                    </div>

                    {/* Valor */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center mb-5">
                        <p className="text-xs font-bold text-green-600 uppercase">Total a pagar</p>
                        <p className="text-4xl font-black text-green-700 mt-1">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(order?.total || 0)}
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="bg-gray-50 border-2 border-dashed border-green-300 rounded-2xl p-5 flex items-center justify-center mb-5">
                        {order?.pix_qrcode ? (
                            <div className="text-center">
                                <img
                                    src={`data:image/jpeg;base64,${order.pix_qrcode}`}
                                    alt="QR Code PIX"
                                    className="w-56 h-56 mx-auto rounded-xl shadow-md"
                                />
                                <p className="text-xs text-gray-400 mt-2 font-medium">Abra o app do banco e escaneie</p>
                            </div>
                        ) : (
                            <div className="text-center text-gray-300 py-8">
                                <QrCode className="w-16 h-16 mx-auto mb-2" />
                                <p className="text-sm">QR Code não disponível</p>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 border-t-2 border-gray-100" />
                        <span className="text-xs font-bold text-gray-400">COPIA E COLA</span>
                        <div className="flex-1 border-t-2 border-gray-100" />
                    </div>

                    {/* Código */}
                    {order?.pix_code && (
                        <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-3 mb-4">
                            <p className="text-xs font-mono text-gray-500 break-all leading-relaxed">{order.pix_code}</p>
                        </div>
                    )}

                    {/* Botões */}
                    <div className="space-y-3 mb-5">
                        <button onClick={copy}
                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${copied ? "bg-green-500 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                                }`}>
                            {copied ? <><CheckCircle className="w-5 h-5" /> Copiado!</> : <><Copy className="w-5 h-5" /> Copiar Código PIX</>}
                        </button>

                        <button onClick={sendWhatsApp}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white transition-all active:scale-95">
                            <MessageCircle className="w-5 h-5" /> Enviar pelo WhatsApp
                        </button>
                    </div>

                    {/* Aguardando */}
                    <div className="flex items-center gap-2 text-cyan-600 bg-cyan-50 rounded-xl p-3 border border-cyan-200 text-xs font-semibold">
                        <Loader className="w-4 h-4 animate-spin flex-shrink-0" />
                        Aguardando pagamento... A tela atualiza automaticamente a cada 10s.
                    </div>

                    <button onClick={() => navigate("/")}
                        className="mt-5 flex items-center gap-2 text-gray-400 hover:text-gray-600 font-bold mx-auto text-sm transition-all">
                        <ArrowLeft className="w-4 h-4" /> Voltar ao início
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}
