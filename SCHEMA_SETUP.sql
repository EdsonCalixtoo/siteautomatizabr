-- ========================================================
-- ⚙️ CONFIGURAÇÃO DE ESTRUTURA DO BANCO DE DADOS (Site Automatiza)
-- ========================================================

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  images TEXT[], -- Array de base64 ou URLs
  features TEXT[], -- Array de características/o que está incluso
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  weight TEXT,
  dimensions TEXT,
  warranty TEXT,
  material TEXT,
  status TEXT DEFAULT 'ativo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Tabela de Cupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expiry_date TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL, -- Array de items
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address JSONB, -- Endereço completo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Tabela de Vendedores/Sellers
CREATE TABLE IF NOT EXISTS sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar TEXT,
  categories TEXT[], -- Array de categorias
  total_sales DECIMAL(10, 2) DEFAULT 0,
  commission_rate DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Ajustes finos de colunas de Pedidos
ALTER TABLE IF EXISTS public.pedidos 
    ADD COLUMN IF NOT EXISTS cliente_telefone TEXT,
    ADD COLUMN IF NOT EXISTS endereco JSONB,
    ADD COLUMN IF NOT EXISTS itens JSONB,
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS frete NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS desconto NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT,
    ADD COLUMN IF NOT EXISTS cupom TEXT,
    ADD COLUMN IF NOT EXISTS tipo_entrega TEXT DEFAULT 'entrega',
    ADD COLUMN IF NOT EXISTS ano_veiculo TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'aguardando_pagamento',
    ADD COLUMN IF NOT EXISTS pix_code TEXT,
    ADD COLUMN IF NOT EXISTS pix_qrcode TEXT,
    ADD COLUMN IF NOT EXISTS mp_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

-- Tabelas adicionais para Categorias Dinâmicas
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    "key" TEXT UNIQUE NOT NULL,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- INDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - SEGURANÇA
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Políticas de SELECT público (Todos podem ver os produtos e categorias)
DROP POLICY IF EXISTS "Produtos visíveis para todos" ON products;
CREATE POLICY "Produtos visíveis para todos" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cupons visíveis para todos" ON coupons;
CREATE POLICY "Cupons visíveis para todos" ON coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categorias visíveis para todos" ON public.categories;
CREATE POLICY "Categorias visíveis para todos" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Subcategorias visíveis para todos" ON public.subcategories;
CREATE POLICY "Subcategorias visíveis para todos" ON public.subcategories FOR SELECT USING (true);

-- Políticas de escrita e modificação (Apenas usuários autenticados via Admin)
DROP POLICY IF EXISTS "Usuários podem criar produtos" ON products;
CREATE POLICY "Usuários podem criar produtos" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios produtos" ON products;
CREATE POLICY "Usuários podem atualizar seus próprios produtos" ON products FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios produtos" ON products;
CREATE POLICY "Usuários podem deletar seus próprios produtos" ON products FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Categorias gerenciáveis por admins" ON public.categories;
CREATE POLICY "Categorias gerenciáveis por admins" ON public.categories FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Subcategorias gerenciáveis por admins" ON public.subcategories;
CREATE POLICY "Subcategorias gerenciáveis por admins" ON public.subcategories FOR ALL USING (auth.uid() = user_id);
