-- ============================================
-- ADICIONAR CATEGORIAS DE KITS FALTANTES
-- ============================================

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users.';
        RETURN;
    END IF;

    -- =====================================
    -- 1. CRIAR AS CATEGORIAS DE KITS/OUTROS
    -- =====================================

    -- Kit Completo
    INSERT INTO categories (name, key, user_id) VALUES ('Kit Completo', 'completo', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name;

    -- Kit Simples
    INSERT INTO categories (name, key, user_id) VALUES ('Kit Simples', 'simples', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name;

    -- Consumíveis & Peças
    INSERT INTO categories (name, key, user_id) VALUES ('Consumíveis & Peças', 'consumivel', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name;

    -- Se existirem produtos com essas categorias que precisem de correção:
    -- (As chaves 'completo', 'simples', 'consumivel' são as usadas como category no form)
    -- Os produtos já deveriam estar usando essas keys se foram salvos corretamente.
    
    RAISE NOTICE 'Categorias adicionadas com sucesso!';

END $$;
