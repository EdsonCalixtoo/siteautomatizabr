-- ============================================
-- CORREÇÃO DE CATEGORIAS E PRODUTOS
-- ============================================

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
    
    -- Variáveis para guardar os IDs das categorias
    v_cat_sprinter UUID;
    v_cat_daily UUID;
    v_cat_ducato UUID;
    v_cat_boxer UUID;
    v_cat_jumper UUID;
    v_cat_kombi UUID;
    v_cat_master UUID;
    
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users.';
        RETURN;
    END IF;

    -- =====================================
    -- 1. CRIAR AS CATEGORIAS (VEÍCULOS)
    -- =====================================

    -- Mercedes Sprinter
    INSERT INTO categories (name, key, user_id) VALUES ('Mercedes - Sprinter', 'mercedes-sprinter', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_sprinter;

    -- Iveco Daily
    INSERT INTO categories (name, key, user_id) VALUES ('Iveco - Daily', 'iveco-daily', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_daily;

    -- Fiat Ducato
    INSERT INTO categories (name, key, user_id) VALUES ('Fiat - Ducato', 'fiat-ducato', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_ducato;

    -- Peugeot Boxer
    INSERT INTO categories (name, key, user_id) VALUES ('Peugeot - Boxer', 'peugeot-boxer', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_boxer;

    -- Citroen Jumper
    INSERT INTO categories (name, key, user_id) VALUES ('Citroen - Jumper', 'citroen-jumper', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_jumper;

    -- VW Kombi
    INSERT INTO categories (name, key, user_id) VALUES ('Volkswagen - Kombi', 'vw-kombi', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_kombi;

    -- Renault Master
    INSERT INTO categories (name, key, user_id) VALUES ('Renault - Master', 'renault-master', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_master;


    -- =====================================
    -- 2. CRIAR SUBCATEGORIAS (Com Sensor / Sem Sensor)
    -- =====================================

    -- Sprinter
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_sprinter, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_sprinter, 'Sem Sensor', v_user_id);

    -- Daily
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_daily, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_daily, 'Sem Sensor', v_user_id);

    -- Ducato
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_ducato, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_ducato, 'Sem Sensor', v_user_id);

    -- Boxer
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_boxer, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_boxer, 'Sem Sensor', v_user_id);

    -- Jumper
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_jumper, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_jumper, 'Sem Sensor', v_user_id);

    -- Kombi
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_kombi, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_kombi, 'Sem Sensor', v_user_id);

    -- Master
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_master, 'Com Sensor', v_user_id);
    INSERT INTO subcategories (category_id, name, user_id) VALUES (v_cat_master, 'Sem Sensor', v_user_id);

    
    -- =====================================
    -- 3. ATUALIZAR PRODUTOS EXISTENTES
    -- =====================================
    
    -- Como eles foram inseridos com category='completo', vamos mudar para a key do veículo:
    UPDATE products SET category = 'mercedes-sprinter' WHERE name LIKE '%SPRINTER%';
    UPDATE products SET category = 'iveco-daily'       WHERE name LIKE '%DAILY%';
    UPDATE products SET category = 'fiat-ducato'       WHERE name LIKE '%DUCATO%';
    UPDATE products SET category = 'peugeot-boxer'     WHERE name LIKE '%BOXER%';
    UPDATE products SET category = 'citroen-jumper'    WHERE name LIKE '%JUMPER%';
    UPDATE products SET category = 'vw-kombi'          WHERE name LIKE '%KOMBI%';
    UPDATE products SET category = 'renault-master'    WHERE name LIKE '%MASTER%';

    -- Limpar a categoria antiga 'completo' se ela não tiver mais produtos
    DELETE FROM categories WHERE key = 'completo';

END $$;
