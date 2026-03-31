import { supabase } from "./supabase";

// Helper to interact with Mercado Pago SDK
export const initMercadoPago = () => {
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    if (!publicKey) {
        console.error("Mercado Pago Public Key not found in environment variables.");
        return null;
    }

    // @ts-ignore - MercadoPago is loaded via script tag in index.html
    if (window.MercadoPago) {
        // @ts-ignore
        return new window.MercadoPago(publicKey, {
            locale: 'pt-BR'
        });
    }

    console.error("Mercado Pago SDK not loaded.");
    return null;
};

// This function calls the Supabase Edge Function
export const createPreference = async (items: any[], customer: any, orderId: string) => {
    try {
        const { data, error } = await supabase.functions.invoke('mercadopago-checkout', {
            body: { items, customer, orderId }
        });

        if (error) throw error;

        return data; // { id, init_point }
    } catch (error) {
        console.error("Error creating preference:", error);
        throw error;
    }
};
