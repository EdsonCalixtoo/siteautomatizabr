-- ============================================
-- ADICIONAR VEÍCULOS FALTANTES
-- ============================================

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
    
    -- Variáveis para guardar os IDs das categorias
    v_cat_jumpy UUID;
    v_cat_scudo UUID;
    v_cat_transit UUID;
    v_cat_besta UUID;
    v_cat_expert UUID;
    
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users.';
        RETURN;
    END IF;

    -- =====================================
    -- 1. CRIAR AS CATEGORIAS (VEÍCULOS FALTANTES)
    -- =====================================

    -- Citroen Jumpy
    INSERT INTO categories (name, key, user_id) VALUES ('Citroen - Jumpy', 'citroen-jumpy', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_jumpy;

    -- Fiat Scudo
    INSERT INTO categories (name, key, user_id) VALUES ('Fiat Scudo', 'fiat-scudo', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_scudo;

    -- Ford Transit
    INSERT INTO categories (name, key, user_id) VALUES ('Ford - Transit', 'ford-transit', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_transit;

    -- Kia Besta
    INSERT INTO categories (name, key, user_id) VALUES ('Kia - Besta', 'kia-besta', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_besta;

    -- Peugeot Expert
    INSERT INTO categories (name, key, user_id) VALUES ('Peugeot Expert', 'peugeot-expert', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_expert;

    -- =====================================
    -- 2. CRIAR SUBCATEGORIAS (Com Sensor / Sem Sensor)
    -- =====================================

    -- Citroen Jumpy
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_jumpy, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_jumpy, 'Sem Sensor', v_user_id);

    -- Fiat Scudo
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_scudo, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_scudo, 'Sem Sensor', v_user_id);

    -- Ford Transit
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_transit, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_transit, 'Sem Sensor', v_user_id);

    -- Kia Besta
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_besta, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_besta, 'Sem Sensor', v_user_id);

    -- Peugeot Expert
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_expert, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_expert, 'Sem Sensor', v_user_id);

END $$;
