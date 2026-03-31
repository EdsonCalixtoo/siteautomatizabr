-- Script para adicionar a foto e o vídeo em TODOS os produtos no Supabase
-- Execute no SQL Editor do Supabase: https://supabase.com/dashboard

-- 1. Atualiza a imagem principal de todos os produtos
UPDATE products 
SET 
  image = '/ftproduto.jpeg',
  video_url = '/video-demonstrativo.mp4'
WHERE image IS NULL OR image = '' OR image = '/OIG4.jpg';

-- 2. Opcional: Atualiza TODOS os produtos (inclusive os que já tem imagem)
-- Se quiser aplicar em todos sem exceção, use:
-- UPDATE products 
-- SET video_url = '/video-demonstrativo.mp4'
-- WHERE video_url IS NULL OR video_url = '';

-- 3. Verificar resultado
SELECT id, name, image, video_url FROM products ORDER BY name;
