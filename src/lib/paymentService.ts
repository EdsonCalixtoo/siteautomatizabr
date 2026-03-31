import { supabase } from "@/lib/supabase";

/**
 * Cria um pagamento PIX via Supabase Edge Function
 * e retorna o QR Code + código copia e cola
 */
export async function createPixPayment(payload: {
    orderId: string;
    amount: number;
    payerEmail: string;
    description: string;
}) {
    const { data, error } = await supabase.functions.invoke("mercadopago-payment", {
        body: {
            payment_type: "pix",
            transaction_amount: payload.amount,
            payer_email: payload.payerEmail,
            description: payload.description,
            external_reference: payload.orderId,
        },
    });

    if (error) throw new Error(error.message || "Erro ao criar pagamento PIX");
    if (data?.error) throw new Error(data.error);

    const pixCode: string = data?.point_of_interaction?.transaction_data?.qr_code || "";
    const pixQrBase64: string = data?.point_of_interaction?.transaction_data?.qr_code_base64 || "";
    const mpPaymentId: string = String(data?.id || "");

    if (!pixCode) throw new Error("QR Code PIX não foi gerado. Verifique o valor do pedido.");

    return { pixCode, pixQrBase64, mpPaymentId, rawData: data };
}

/**
 * Cria um pagamento com Cartão de Crédito
 */
export async function createCardPayment(payload: {
    orderId: string;
    amount: number;
    payerEmail: string;
    description: string;
    token: string;
    installments: number;
    paymentMethodId: string;
}) {
    const { data, error } = await supabase.functions.invoke("mercadopago-payment", {
        body: {
            payment_type: "credit_card",
            transaction_amount: payload.amount,
            payer_email: payload.payerEmail,
            description: payload.description,
            external_reference: payload.orderId,
            token: payload.token,
            installments: payload.installments,
            payment_method_id: payload.paymentMethodId,
        },
    });

    if (error) throw new Error(error.message || "Erro ao processar cartão");
    if (data?.error) throw new Error(data.error);

    return { status: data?.status, mpPaymentId: String(data?.id || ""), rawData: data };
}

/**
 * Consulta o status de um pagamento no Mercado Pago via Edge Function
 */
export async function checkPaymentStatus(mpPaymentId: string): Promise<"pending" | "approved" | "rejected" | "cancelled"> {
    const { data, error } = await supabase.functions.invoke("mercadopago-payment", {
        body: { check_payment_id: mpPaymentId },
    });

    if (error || !data) return "pending";
    return data.status || "pending";
}
