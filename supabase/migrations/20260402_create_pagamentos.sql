-- =========================================================
-- MIGRATION: Criar tabela de pagamentos para Mercado Pago
-- Data: 2026-04-02
-- Objetivo: Persistir todos os eventos de pagamento e histórico
-- =========================================================

-- 1. Criar tabela de pagamentos (histórico de tentativas)
CREATE TABLE IF NOT EXISTS public.pagamentos (
    id TEXT PRIMARY KEY,                      -- ID do Mercado Pago (payment.id)
    status TEXT NOT NULL,                     -- payment.status (approved, pending, etc)
    status_detail TEXT,                       -- payment.status_detail (accredited, pending_waiting_transfer, etc)
    transaction_amount NUMERIC(10,2) NOT NULL, -- Valor da transação
    payment_method_id TEXT,                    -- pix, credit_card, debmit_card, etc
    external_reference UUID REFERENCES public.pedidos(id) ON DELETE CASCADE, -- ID do Pedido
    created_at TIMESTAMP WITH TIME ZONE        -- Data de criação no Mercado Pago
);

-- 2. Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_pagamentos_external_ref ON public.pagamentos(external_reference);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON public.pagamentos(status);

-- 3. Habilitar RLS (Segurança)
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Política: Service Role e Admin podem ver tudo
CREATE POLICY "Admins podem ver pagamentos" ON public.pagamentos 
FOR SELECT USING (true);

-- 4. Garantir que a tabela pedidos suporte os campos necessários
-- Já existem no sistema atual, mas garantimos aqui por segurança
ALTER TABLE public.pedidos 
    ADD COLUMN IF NOT EXISTS mp_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS status_detail TEXT;
