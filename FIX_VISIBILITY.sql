-- ============================================
-- ATUALIZAÇÃO DE PRIVACIDADE DE PRODUTOS
-- ============================================

-- Remover política restritiva anterior
DROP POLICY IF EXISTS "Usuários podem ver seus próprios produtos" ON products;

-- Criar nova política para que QUALQUER UM possa ver os produtos
-- Isso torna os produtos públicos (visíveis para visitantes não logados)
CREATE POLICY "Produtos visíveis para todos"
  ON products FOR SELECT
  USING (true);

-- Também tornar os cupons públicos para que possam ser validados no checkout
DROP POLICY IF EXISTS "Usuários podem ver seus próprios cupons" ON coupons;
CREATE POLICY "Cupons visíveis para todos"
  ON coupons FOR SELECT
  USING (true);

-- ============================================
-- INSTRUÇÕES
-- ============================================
-- 1. Vá para o SQL Editor no Supabase
-- 2. Cole este código e execute
-- ============================================
