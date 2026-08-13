import { supabase } from "@/lib/supabase";

/**
 * Cria um novo pedido no Supabase com status "aguardando_pagamento"
 */
export async function createOrder(payload: {
    cliente_nome: string;
    cliente_email: string;
    cliente_telefone?: string;
    endereco?: object;
    itens: object[];
    subtotal: number;
    frete: number;
    desconto: number;
    total: number;
    metodo_pagamento: "pix" | "cartao";
    cupom?: string;
    tipo_entrega?: "entrega" | "retirada";
    ano_veiculo?: string;
    cliente_cpf_cnpj?: string;
    cartao_final?: string;
}) {
    const { data, error } = await supabase
        .from("orders")
        .insert({
            cliente_nome: payload.cliente_nome,
            cliente_email: payload.cliente_email,
            cliente_telefone: payload.cliente_telefone || null,
            endereco: payload.endereco || null,
            itens: payload.itens,
            subtotal: payload.subtotal,
            frete: payload.frete,
            desconto: payload.desconto,
            total: payload.total,
            metodo_pagamento: payload.metodo_pagamento,
            cupom: payload.cupom || null,
            tipo_entrega: payload.tipo_entrega || "entrega",
            ano_veiculo: payload.ano_veiculo || null,
            cliente_cpf_cnpj: payload.cliente_cpf_cnpj || null,
            cartao_final: payload.cartao_final || null,
            status: "aguardando_pagamento",
        })
        .select()
        .single();

    if (error) throw new Error(`Erro ao criar pedido: ${error.message}`);
    
    // Tentar enviar e-mail de "Novo Pedido" e "Aguardando Pagamento"
    try {
        await supabase.functions.invoke('send-order-email', {
            body: { 
                order: data, 
                type: 'novo_pedido' 
            }
        });
    } catch (e) {
        console.warn('Erro ao disparar e-mail:', e);
    }

    return data;
}

/**
 * Busca um pedido pelo ID
 */
export async function getOrder(orderId: string) {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

    if (error) throw new Error(`Pedido não encontrado: ${error.message}`);
    return data;
}

/**
 * Atualiza o status de um pedido
 */
export async function updateOrderStatus(
    orderId: string,
    status: "aguardando_pagamento" | "pago" | "cancelado" | "recusado",
    extra?: { pix_code?: string; pix_qrcode?: string; mp_payment_id?: string; cartao_final?: string }
) {
    const updateData: any = { status };
    if (extra?.pix_code) updateData.pix_code = extra.pix_code;
    if (extra?.pix_qrcode) updateData.pix_qrcode = extra.pix_qrcode;
    if (extra?.mp_payment_id) updateData.mp_payment_id = extra.mp_payment_id;
    if (extra?.cartao_final) updateData.cartao_final = extra.cartao_final;
    if (status === "pago") updateData.data_pagamento = new Date().toISOString();

    const { data: order, error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId)
        .select()
        .single();

    if (error) throw new Error(`Erro ao atualizar pedido: ${error.message}`);

    // Se o status mudou para pago, disparar e-mail de confirmação
    if (status === "pago") {
        try {
            await supabase.functions.invoke('send-order-email', {
                body: { 
                    order: order, 
                    type: 'pagamento_aprovado' 
                }
            });
        } catch (e) {
            console.warn('Erro ao disparar e-mail de pagamento:', e);
        }
    } else if (status === "cancelado" || status === "recusado") {
        try {
            await supabase.functions.invoke('send-order-email', {
                body: {
                    order: order,
                    type: 'pedido_cancelado'
                }
            });
        } catch (e) {
            console.warn('Erro ao disparar e-mail de cancelamento:', e);
        }
    }

    return order;
}

/**
 * Lista todos os pedidos do sistema
 */
export async function listOrders() {
    const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw new Error(`Erro ao buscar pedidos: ${error.message}`);
    return data;
}

/**
 * Deleta um pedido definitivamente
 */
export async function deleteOrder(orderId: string) {
    const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);

    if (error) throw new Error(`Erro ao deletar pedido: ${error.message}`);
    return true;
}

/**
 * Sincroniza o status de um pedido com o Mercado Pago
 */
export async function syncOrderWithMercadoPago(orderId: string, mpPaymentId: string) {
    const { supabaseUrl, supabaseAnonKey } = (await import("@/lib/supabase"));
    
    const response = await fetch(`${supabaseUrl}/functions/v1/mercadopago-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
            check_payment_id: mpPaymentId,
            orderId: orderId
        }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Erro ao consultar Mercado Pago");
    }

    const data = await response.json();
    
    // Mapear status do MP para nosso sistema
    const statusMapping: Record<string, string> = {
        'approved': 'pago',
        'pending': 'aguardando',
        'in_process': 'aguardando',
        'rejected': 'recusado',
        'cancelled': 'cancelado'
    };

    const novoStatus = statusMapping[data.status] || 'aguardando';
    
    // Se o status for diferente do atual ou for 'pago', atualizar no banco
    await updateOrderStatus(orderId, novoStatus as any);
    
    return { 
        status: novoStatus, 
        mpStatus: data.status, 
        detail: data.status_detail 
    };
}

/**
 * Busca logs de pagamento para um pedido
 */
export async function listOrderLogs(orderId: string) {
    const { data, error } = await supabase
        .from("pagamentos")
        .select("*")
        .eq("external_reference", orderId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data;
}
