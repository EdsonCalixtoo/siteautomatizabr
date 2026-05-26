-- ============================================
-- CRIAÇÃO DE CATEGORIAS E SUBCATEGORIAS
-- ============================================

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
    v_cat_completo_id UUID;
    v_cat_acessorio_id UUID;
    v_cat_simples_id UUID;
    v_cat_consumivel_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users.';
        RETURN;
    END IF;

    -- =====================================
    -- 1. CRIAR CATEGORIAS PRINCIPAIS
    -- =====================================

    -- Kit Completo
    INSERT INTO categories (name, key, user_id)
    VALUES ('🏆 Kit Completo', 'completo', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_completo_id;

    -- Acessórios
    INSERT INTO categories (name, key, user_id)
    VALUES ('🔧 Acessório', 'acessorio', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_acessorio_id;

    -- Kit Simples
    INSERT INTO categories (name, key, user_id)
    VALUES ('⚡ Kit Simples', 'simples', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_simples_id;

    -- Peças & Consumíveis
    INSERT INTO categories (name, key, user_id)
    VALUES ('📦 Peças & Consumíveis', 'consumivel', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_cat_consumivel_id;


    -- =====================================
    -- 2. CRIAR SUBCATEGORIAS
    -- =====================================

    -- Subcategorias para 'Kit Completo'
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_completo_id, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_completo_id, 'Sem Sensor', v_user_id);

    -- Subcategorias para 'Acessório'
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_acessorio_id, 'Motores', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_acessorio_id, 'Sensores', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_acessorio_id, 'Controles', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_acessorio_id, 'Cremalheira', v_user_id);

    -- Subcategorias para 'Kit Simples'
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_simples_id, 'Kit Essencial', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_simples_id, 'Motor Econômico', v_user_id);

    -- Subcategorias para 'Peças & Consumíveis'
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_consumivel_id, 'Óleo', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_consumivel_id, 'Graxa', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_consumivel_id, 'Filtro', v_user_id);

END $$;
