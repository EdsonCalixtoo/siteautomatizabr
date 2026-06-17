-- ============================================
-- REMOVER CATEGORIA DUPLICADA "Peças"
-- ============================================

DO $$
BEGIN

    -- 1. Atualizar qualquer produto que esteja usando a key 'Peças' (maiúscula) 
    -- para usar a key correta 'pecas' (minúscula) criada pelo script anterior.
    UPDATE products 
    SET category = 'pecas' 
    WHERE category = 'Peças';

    -- 2. Deletar a categoria duplicada que tem a key 'Peças'
    DELETE FROM categories 
    WHERE key = 'Peças';

    RAISE NOTICE 'Categoria duplicada removida com sucesso!';

END $$;
