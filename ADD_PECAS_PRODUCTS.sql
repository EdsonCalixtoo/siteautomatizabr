-- ============================================
-- ADICIONAR PRODUTOS NA CATEGORIA PEÇAS
-- ============================================

DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
    v_cat_pecas UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE 'Nenhum usuário encontrado em auth.users.';
        RETURN;
    END IF;

    -- 1. CRIAR A CATEGORIA 'PEÇAS' (se não existir)
    INSERT INTO categories (name, key, user_id) 
    VALUES ('Peças', 'pecas', v_user_id)
    ON CONFLICT (key) DO UPDATE SET name = EXCLUDED.name 
    RETURNING id INTO v_cat_pecas;

    -- 2. INSERIR OS PRODUTOS (se não existirem)
    -- Para evitar duplicatas, checamos pelo nome e categoria
    
    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'BOTÃO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('BOTÃO', 'Botão', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'BRAÇO ARTICULADO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('BRAÇO ARTICULADO', 'Braço Articulado', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'BRAÇO INTERNO (MOTOR)' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('BRAÇO INTERNO (MOTOR)', 'Braço Interno do Motor', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'BRAÇO DO MANUAL' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('BRAÇO DO MANUAL', 'Braço do Manual', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'BASE' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('BASE', 'Base', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CONTROLE REMOTO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CONTROLE REMOTO', 'Controle Remoto', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CHICOTE DO MOTOR' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CHICOTE DO MOTOR', 'Chicote do Motor', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CHICOTE DA PLACA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CHICOTE DA PLACA', 'Chicote da Placa', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CHICOTE DA BATERIA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CHICOTE DA BATERIA', 'Chicote da Bateria', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CREMALHEIRAS (90CM, 1MT, 1,10CM E 1,20CM)' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CREMALHEIRAS (90CM, 1MT, 1,10CM E 1,20CM)', 'Cremalheiras de diversos tamanhos', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CORTINA DE CREMALHEIRA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CORTINA DE CREMALHEIRA', 'Cortina de Cremalheira', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'CAPA PLÁSTICA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('CAPA PLÁSTICA', 'Capa Plástica', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'COURINO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('COURINO', 'Courino', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'ENGRENAGEM (12 DENTES E 16 DENTES)' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('ENGRENAGEM (12 DENTES E 16 DENTES)', 'Engrenagem 12 dentes e 16 dentes', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'FINAL DE CURSO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('FINAL DE CURSO', 'Final de Curso', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'FUSÍVEL' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('FUSÍVEL', 'Fusível', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'IMÃS DE CREMALHEIRA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('IMÃS DE CREMALHEIRA', 'Imãs de Cremalheira', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'KIT DE ESPAÇADORES' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('KIT DE ESPAÇADORES', 'Kit de Espaçadores', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'KIT DE INSTALAÇÃO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('KIT DE INSTALAÇÃO', 'Kit de Instalação', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PAR DE NYLON' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PAR DE NYLON', 'Par de Nylon', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PAR DE SENSORES ANTI ESMAGAMENTO' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PAR DE SENSORES ANTI ESMAGAMENTO', 'Par de Sensores Anti Esmagamento', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PAR DE ROTULAS' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PAR DE ROTULAS', 'Par de Rótulas', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PROTEÇÃO DO SUPORTE COLUNA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PROTEÇÃO DO SUPORTE COLUNA', 'Proteção do Suporte Coluna', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PROTEÇÃO DE SENSOR' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PROTEÇÃO DE SENSOR', 'Proteção de Sensor', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PATOLA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PATOLA', 'Patola', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM products WHERE name = 'PLACA ELETRÔNICA' AND category = 'pecas') THEN
        INSERT INTO products (name, description, category, subcategory, price, stock, user_id, status)
        VALUES ('PLACA ELETRÔNICA', 'Placa Eletrônica', 'pecas', '', 0.00, 10, v_user_id, 'ativo');
    END IF;

    RAISE NOTICE 'Produtos da categoria Peças adicionados com sucesso!';

END $$;
