-- Adicionando a coluna que falta no banco (só por garantia)
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS short_description TEXT;

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users. Crie um usuário primeiro.';
        RETURN;
    END IF;

    -- =====================================
    -- KITS FALTANTES (Sem .N ou .A)
    -- =====================================

    -- SPRINTER
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT SPRINTER - COM SENSOR', 'Sistema completo para automação de porta lateral de vans Mercedes Sprinter. Proporciona abertura e fechamento automático da porta, trazendo mais conforto, segurança e praticidade no dia a dia.', 'Automação para Mercedes Sprinter com sensor.', 'completo', 'Com Sensor', 1850.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT SPRINTER - SEM SENSOR', 'Sistema completo para automação de porta lateral de vans Mercedes Sprinter. Proporciona abertura e fechamento automático da porta, trazendo mais conforto, segurança e praticidade no dia a dia.', 'Automação para Mercedes Sprinter sem sensor.', 'completo', 'Sem Sensor', 1650.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m'], v_user_id, 'ativo');

    -- DAILY
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT DAILY - COM SENSOR', 'Kit completo para automação de porta lateral da Iveco Daily, garantindo praticidade e segurança no uso diário.', 'Automação para Iveco Daily com sensor.', 'completo', 'Com Sensor', 1850.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT DAILY - SEM SENSOR', 'Kit completo para automação de porta lateral da Iveco Daily, garantindo praticidade e segurança no uso diário.', 'Automação para Iveco Daily sem sensor.', 'completo', 'Sem Sensor', 1650.00, 10, ARRAY['Chicote elétrico', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Trava em U', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m'], v_user_id, 'ativo');

    -- MASTER
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT MASTER - COM SENSOR', 'Sistema de automação para porta lateral da Renault Master, trazendo praticidade e segurança.', 'Automação para Renault Master com sensor.', 'completo', 'Com Sensor', 1850.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m', 'Sensor Anti-Esmagamento'], v_user_id, 'ativo');
    
    INSERT INTO products (name, description, short_description, category, subcategory, price, stock, features, user_id, status)
    VALUES ('KIT MASTER - SEM SENSOR', 'Sistema de automação para porta lateral da Renault Master, trazendo praticidade e segurança.', 'Automação para Renault Master sem sensor.', 'completo', 'Sem Sensor', 1650.00, 10, ARRAY['Chicote', 'Suporte da coluna', 'Courinho com capinha', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Abraçadeira plástica', 'Fusível', 'Parafuso Allen', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 40mm', 'Espaçador 60mm', 'Espaçador 60mm', 'Adesivo', 'Adesivo', 'Garantia', 'Colar azul', 'Cremalheira 1,20m'], v_user_id, 'ativo');

END $$;
