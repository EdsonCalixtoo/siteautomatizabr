-- ============================================
-- ORGANIZAÇÃO DO CATÁLOGO AUTOMATIZA
-- ============================================

-- 1. LIMPEZA OPCIONAL (Remover produtos antigos da categoria 'completo' se desejar)
-- DELETE FROM products WHERE category = 'completo';

-- 2. INSERÇÃO DOS NOVOS KITS PADRONIZADOS
-- Nota: Este script assume que você deseja vincular ao primeiro usuário encontrado no sistema.
-- Se houver múltiplos usuários admin, substitua (SELECT id FROM auth.users LIMIT 1) pelo ID correto.

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
BEGIN
    -- Se não houver usuários, o script não funcionará devido às políticas de RLS
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users. Crie um usuário primeiro.';
        RETURN;
    END IF;

    -- Inserir os 18 kits (2 versões para cada um dos 9 veículos)
    
    -- SPRINTER .N
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT SPRINTER .N - COM SENSOR', 'Sistema completo para automação de porta lateral de vans Mercedes Sprinter nova. Proporciona abertura e fechamento automático da porta, trazendo mais conforto, segurança e praticidade no dia a dia.', 'Automação para Mercedes Sprinter nova com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT SPRINTER .N - SEM SENSOR', 'Sistema completo para automação de porta lateral de vans Mercedes Sprinter nova. Proporciona abertura e fechamento automático da porta, trazendo mais conforto, segurança e praticidade no dia a dia.', 'Automação para Mercedes Sprinter nova sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m'], v_user_id, 'ativo');

    -- DAILY .N
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT DAILY .N - COM SENSOR', 'Kit completo para automação de porta lateral da Iveco Daily nova, garantindo praticidade e segurança no uso diário.', 'Automação para Iveco Daily nova com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT DAILY .N - SEM SENSOR', 'Kit completo para automação de porta lateral da Iveco Daily nova, garantindo praticidade e segurança no uso diário.', 'Automação para Iveco Daily nova sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m'], v_user_id, 'ativo');

    -- DUCATO
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT DUCATO - COM SENSOR', 'Sistema de automação para porta lateral da Fiat Ducato, proporcionando abertura automática com segurança e conforto.', 'Automação para Fiat Ducato com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT DUCATO - SEM SENSOR', 'Sistema de automação para porta lateral da Fiat Ducato, proporcionando abertura automática com segurança e conforto.', 'Automação para Fiat Ducato sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote'], v_user_id, 'ativo');

    -- BOXER
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT BOXER - COM SENSOR', 'Sistema de automação para porta lateral da Peugeot Boxer, proporcionando abertura automática com segurança e conforto.', 'Automação para Peugeot Boxer com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT BOXER - SEM SENSOR', 'Sistema de automação para porta lateral da Peugeot Boxer, proporcionando abertura automática com segurança e conforto.', 'Automação para Peugeot Boxer sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote'], v_user_id, 'ativo');

    -- JUMPER
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT JUMPER - COM SENSOR', 'Sistema de automação para porta lateral da Citroen Jumper, proporcionando abertura automática com segurança e conforto.', 'Automação para Citroen Jumper com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT JUMPER - SEM SENSOR', 'Sistema de automação para porta lateral da Citroen Jumper, proporcionando abertura automática com segurança e conforto.', 'Automação para Citroen Jumper sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote'], v_user_id, 'ativo');

    -- KOMBI
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT KOMBI - COM SENSOR', 'Sistema de automação para porta lateral da VW Kombi, proporcionando abertura automática com segurança e conforto.', 'Automação para VW Kombi com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT KOMBI - SEM SENSOR', 'Sistema de automação para porta lateral da VW Kombi, proporcionando abertura automática com segurança e conforto.', 'Automação para VW Kombi sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Porta fusível', 'Parafuso Allen', 'Trava cabo', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Courinho com capinha', 'Suporte da coluna', 'Adesivo', 'Adesivo', 'Adesivo', 'Garantia', 'Cremalheira 1,10m', 'Chicote'], v_user_id, 'ativo');

    -- MASTER .N
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT MASTER .N - COM SENSOR', 'Sistema de automação para porta lateral da Renault Master nova, trazendo praticidade e segurança.', 'Automação para Renault Master nova com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT MASTER .N - SEM SENSOR', 'Sistema de automação para porta lateral da Renault Master nova, trazendo praticidade e segurança.', 'Automação para Renault Master nova sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m'], v_user_id, 'ativo');

    -- MASTER .A
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT MASTER .A - COM SENSOR', 'Kit de automação para porta lateral da Renault Master antiga.', 'Automação para Renault Master antiga com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Trava cabo', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,00m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT MASTER .A - SEM SENSOR', 'Kit de automação para porta lateral da Renault Master antiga.', 'Automação para Renault Master antiga sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Trava cabo', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,00m'], v_user_id, 'ativo');

    -- SPRINTER .A
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT SPRINTER .A - COM SENSOR', 'Sistema de automação para porta lateral da Sprinter antiga.', 'Automação para Mercedes Sprinter antiga com sensor.', 'completo', 'Com Sensor', 2499.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Trava cabo', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 0,90m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT SPRINTER .A - SEM SENSOR', 'Sistema de automação para porta lateral da Sprinter antiga.', 'Automação para Mercedes Sprinter antiga sem sensor.', 'completo', 'Sem Sensor', 2499.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Trava cabo', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Espaçador pequeno', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 0,90m'], v_user_id, 'ativo');

END $$;
