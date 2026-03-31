-- Adiciona a coluna ano_veiculo na tabela de pedidos
ALTER TABLE IF EXISTS public.pedidos 
ADD COLUMN IF NOT EXISTS ano_veiculo TEXT;
