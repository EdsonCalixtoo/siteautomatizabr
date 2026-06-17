-- ============================================
-- CORRIGIR POLÍTICAS DE SEGURANÇA (RLS)
-- Permite que administradores logados possam adicionar, editar e remover
-- qualquer categoria ou produto, mesmo que tenham sido criados por outro usuário (ou script).
-- ============================================

-- Categorias
DROP POLICY IF EXISTS "Categorias gerenciáveis por admins" ON public.categories;
CREATE POLICY "Categorias gerenciáveis por admins" ON public.categories 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Subcategorias
DROP POLICY IF EXISTS "Subcategorias gerenciáveis por admins" ON public.subcategories;
CREATE POLICY "Subcategorias gerenciáveis por admins" ON public.subcategories 
FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- Produtos
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios produtos" ON products;
CREATE POLICY "Usuários podem atualizar seus próprios produtos" ON products 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios produtos" ON products;
CREATE POLICY "Usuários podem deletar seus próprios produtos" ON products 
FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem criar produtos" ON products;
CREATE POLICY "Usuários podem criar produtos" ON products 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Cupons
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios cupons" ON coupons;
CREATE POLICY "Usuários podem atualizar seus próprios cupons" ON coupons 
FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem deletar seus próprios cupons" ON coupons;
CREATE POLICY "Usuários podem deletar seus próprios cupons" ON coupons 
FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Usuários podem criar cupons" ON coupons;
CREATE POLICY "Usuários podem criar cupons" ON coupons 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

