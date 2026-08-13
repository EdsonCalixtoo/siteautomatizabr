-- ============================================
-- FIX: RECRIAÇÃO DA TABELA DE PEDIDOS (ORDERS) COM AS COLUNAS CORRETAS
-- ============================================

-- Remover a tabela antiga (que estava com colunas em inglês)
DROP TABLE IF EXISTS public.orders CASCADE;

-- Criar a tabela com as colunas em português esperadas pelo sistema
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_nome TEXT NOT NULL,
  cliente_email TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_cpf_cnpj TEXT,
  endereco JSONB,
  itens JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  frete NUMERIC NOT NULL,
  desconto NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  metodo_pagamento TEXT NOT NULL,
  cupom TEXT,
  tipo_entrega TEXT DEFAULT 'entrega',
  ano_veiculo TEXT,
  cartao_final TEXT,
  status TEXT DEFAULT 'aguardando_pagamento',
  pix_code TEXT,
  pix_qrcode TEXT,
  mp_payment_id TEXT,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) E POLÍTICAS
-- ============================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Permitir leitura (Admin e usuários)
CREATE POLICY "Leitura de pedidos"
  ON public.orders FOR SELECT
  USING (true);

-- Permitir criação de pedidos (checkout anônimo/visitantes)
CREATE POLICY "Criação de pedidos anônima"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Permitir atualização de pedidos (para webhooks e admin)
CREATE POLICY "Atualização de pedidos"
  ON public.orders FOR UPDATE
  USING (true);

-- ============================================
-- ✅ Pronto! Tabela orders corrigida.
