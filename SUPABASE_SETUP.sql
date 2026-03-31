-- ============================================
-- TABELAS PARA SUPABASE - AUTOMATIZA
-- ============================================

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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
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
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================
-- INDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
CREATE INDEX IF NOT EXISTS idx_coupons_user_id ON coupons(user_id);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

CREATE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email);
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON sellers(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) - SEGURANÇA
-- ============================================

-- Ativar RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;

-- Políticas para Produtos (públicos)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios produtos" ON products;
CREATE POLICY "Produtos visíveis para todos"
  ON products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Usuários podem criar produtos" ON products;
CREATE POLICY "Usuários podem criar produtos"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios produtos" ON products;
CREATE POLICY "Usuários podem atualizar seus próprios produtos"
  ON products FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios produtos" ON products;
CREATE POLICY "Usuários podem deletar seus próprios produtos"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para Cupons (públicos)
DROP POLICY IF EXISTS "Usuários podem ver seus próprios cupons" ON coupons;
CREATE POLICY "Cupons visíveis para todos"
  ON coupons FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Usuários podem criar cupons" ON coupons;
CREATE POLICY "Usuários podem criar cupons"
  ON coupons FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus cupons" ON coupons;
CREATE POLICY "Usuários podem atualizar seus cupons"
  ON coupons FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus cupons" ON coupons;
CREATE POLICY "Usuários podem deletar seus cupons"
  ON coupons FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para Pedidos
DROP POLICY IF EXISTS "Usuários podem ver seus próprios pedidos" ON orders;
CREATE POLICY "Usuários podem ver seus próprios pedidos"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar pedidos" ON orders;
CREATE POLICY "Usuários podem criar pedidos"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus pedidos" ON orders;
CREATE POLICY "Usuários podem atualizar seus pedidos"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas para Vendedores
DROP POLICY IF EXISTS "Usuários podem ver seus próprios vendedores" ON sellers;
CREATE POLICY "Usuários podem ver seus próprios vendedores"
  ON sellers FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem criar vendedores" ON sellers;
CREATE POLICY "Usuários podem criar vendedores"
  ON sellers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar seus vendedores" ON sellers;
CREATE POLICY "Usuários podem atualizar seus vendedores"
  ON sellers FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar seus vendedores" ON sellers;
CREATE POLICY "Usuários podem deletar seus vendedores"
  ON sellers FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================
/*
1. Acesse o painel do Supabase: https://app.supabase.com
2. Selecione seu projeto
3. Vá para "SQL Editor"
4. Crie uma nova query
5. Cole todo este SQL
6. Execute

As tabelas e políticas de segurança serão criadas automaticamente!
*/
