-- ========================================================
-- 🛠️ SITE AUTOMATIZA - MIGRATION SETUP
-- Execute este script no SQL Editor do seu novo Supabase para
-- criar a estrutura e permitir a inserção local de dados.
-- ========================================================

-- 1. CRIAÇÃO DE TABELAS
-- ============================================

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image TEXT,
  images TEXT[], 
  features TEXT[], 
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  weight TEXT,
  dimensions TEXT,
  warranty TEXT,
  material TEXT,
  status TEXT DEFAULT 'ativo',
  badge TEXT,
  video_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Tabela de Cupons
CREATE TABLE IF NOT EXISTS public.coupons (
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

-- Tabela de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  items JSONB NOT NULL, 
  total DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'enviado', 'entregue', 'cancelado')),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address JSONB, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Tabela de Vendedores/Sellers
CREATE TABLE IF NOT EXISTS public.sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar TEXT,
  categories TEXT[], 
  total_sales DECIMAL(10, 2) DEFAULT 0,
  commission_rate DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID
);

-- Tabela de Pedidos Legado
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_telefone TEXT,
  endereco JSONB,
  itens JSONB,
  subtotal NUMERIC DEFAULT 0,
  frete NUMERIC DEFAULT 0,
  desconto NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  metodo_pagamento TEXT,
  cupom TEXT,
  tipo_entrega TEXT DEFAULT 'entrega',
  ano_veiculo TEXT,
  status TEXT DEFAULT 'aguardando_pagamento',
  pix_code TEXT,
  pix_qrcode TEXT,
  mp_payment_id TEXT,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabelas para Categorias Dinâmicas
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

-- 2. INDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons(active);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_sellers_email ON public.sellers(email);

-- 3. ROW LEVEL SECURITY (RLS) - SEGURANÇA
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- Políticas de SELECT público (Todos podem ver)
DROP POLICY IF EXISTS "Produtos visíveis para todos" ON public.products;
CREATE POLICY "Produtos visíveis para todos" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Cupons visíveis para todos" ON public.coupons;
CREATE POLICY "Cupons visíveis para todos" ON public.coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Categorias visíveis para todos" ON public.categories;
CREATE POLICY "Categorias visíveis para todos" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Subcategorias visíveis para todos" ON public.subcategories;
CREATE POLICY "Subcategorias visíveis para todos" ON public.subcategories FOR SELECT USING (true);

-- Políticas de escrita e modificação (Apenas usuários autenticados via Admin)
DROP POLICY IF EXISTS "Usuários podem criar produtos" ON public.products;
CREATE POLICY "Usuários podem criar produtos" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios produtos" ON public.products;
CREATE POLICY "Usuários podem atualizar seus próprios produtos" ON public.products FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios produtos" ON public.products;
CREATE POLICY "Usuários podem deletar seus próprios produtos" ON public.products FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Categorias gerenciáveis por admins" ON public.categories;
CREATE POLICY "Categorias gerenciáveis por admins" ON public.categories FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Subcategorias gerenciáveis por admins" ON public.subcategories;
CREATE POLICY "Subcategorias gerenciáveis por admins" ON public.subcategories FOR ALL USING (auth.uid() = user_id);

-- 4. DESABILITAR RLS TEMPORARIAMENTE PARA A MIGRAÇÃO LOCAL
-- ============================================
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sellers DISABLE ROW LEVEL SECURITY;

-- ✅ Estrutura criada e RLS desabilitado para a migração!
