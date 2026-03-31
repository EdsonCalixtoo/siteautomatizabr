-- ============================================
-- ATUALIZAÇÃO DE CATEGORIAS E COLUNAS - AUTOMATIZA
-- ============================================

-- 1. ADICIONAR COLUNAS FALTANTES (SE NÃO EXISTIREM)
-- Execute estas linhas para garantir que o banco de dados suporte todos os campos novos
ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- 2. EXEMPLO DE INSERÇÃO DE PRODUTO COM AS NOVAS CATEGORIAS
-- Este exemplo mostra como inserir um produto para Citroen Jumper
-- Substitua 'auth.uid()' pelo ID do seu usuário se for executar manualmente no console do Supabase
-- Ou use as categorias diretamente no Dashboard admin do site agora que foram adicionadas.

/*
INSERT INTO products (
  name, 
  description, 
  short_description,
  category, 
  subcategory, 
  price, 
  stock, 
  status,
  user_id
) VALUES (
  'Kit Automação Citroen Jumper Premium',
  'Sistema completo com sensor anti-esmagamento e acabamento original.',
  'Automação premium para Citroen Jumper',
  'Portas Automáticas',
  'Citroen - Jumper',
  2499.00,
  10,
  'ativo',
  'seu-user-id-aqui'
);
*/

-- 3. NOTA SOBRE MÍDIAS
-- Você agora pode adicionar URLs de vídeos (.mp4 ou YouTube) e áudios (.mp3) para cada produto.
-- No formulário de produto (Dashboard), preencha os campos "Vídeo" e "Áudio" na seção "Dados Técnicos".
-- O sistema exibirá automaticamente um player de vídeo e um player de áudio na página de detalhes do produto.

-- 4. NOTA SOBRE CATEGORIAS
-- As categorias no sistema são baseadas em TEXTO. 
-- Você pode agora selecionar "Portas Automáticas" no Dashboard 
-- e escolher o modelo da van (ex: "Fiat - Ducato") na subcategoria.
-- A página de produtos já está configurada para filtrar esses novos nomes corretamente.
