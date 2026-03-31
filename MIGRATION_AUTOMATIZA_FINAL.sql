-- ========================================================
-- SCRIPT DE MANUTENÇÃO E NOVAS FUNCIONALIDADES (AUTOMATIZA)
-- ========================================================

-- 1. CORREÇÃO DA TABELA DE PEDIDOS
-- Adiciona colunas que podem estar faltando para evitar o erro de 'tipo_entrega'
ALTER TABLE IF EXISTS public.pedidos 
    ADD COLUMN IF NOT EXISTS cliente_telefone TEXT,
    ADD COLUMN IF NOT EXISTS endereco JSONB,
    ADD COLUMN IF NOT EXISTS itens JSONB,
    ADD COLUMN IF NOT EXISTS subtotal NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS frete NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS desconto NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS total NUMERIC DEFAULT 0,
    ADD COLUMN IF NOT EXISTS metodo_pagamento TEXT,
    ADD COLUMN IF NOT EXISTS cupom TEXT,
    ADD COLUMN IF NOT EXISTS tipo_entrega TEXT DEFAULT 'entrega',
    ADD COLUMN IF NOT EXISTS ano_veiculo TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'aguardando_pagamento',
    ADD COLUMN IF NOT EXISTS pix_code TEXT,
    ADD COLUMN IF NOT EXISTS pix_qrcode TEXT,
    ADD COLUMN IF NOT EXISTS mp_payment_id TEXT,
    ADD COLUMN IF NOT EXISTS data_pagamento TIMESTAMP WITH TIME ZONE;

-- 2. CRIAÇÃO DAS TABELAS PARA CATEGORIAS DINÂMICAS
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    "key" TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. HABILITAR SEGURANÇA (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS DE ACESSO
-- Todos podem ver
CREATE POLICY "Categorias visíveis para todos" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Subcategorias visíveis para todos" ON public.subcategories FOR SELECT USING (true);

-- Apenas o dono (admin) pode modificar
CREATE POLICY "Categorias gerenciáveis por admins" ON public.categories FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Subcategorias gerenciáveis por admins" ON public.subcategories FOR ALL USING (auth.uid() = user_id);

-- 5. SEMEAR CATEGORIAS ATUAIS (Migração do categories.ts para o Banco)
DO $$
DECLARE
    v_user_id UUID := (SELECT id FROM auth.users LIMIT 1);
    v_cat_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE NOTICE '❌ Nenhum usuário encontrado para vincular as categorias. Crie um usuário admin primeiro.';
        RETURN;
    END IF;

    -- Kit Completo
    INSERT INTO public.categories (name, "key", user_id) VALUES ('🏆 Kit Completo', 'completo', v_user_id) 
    ON CONFLICT ("key") DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_id;
    INSERT INTO public.subcategories (name, category_id, user_id) VALUES 
        ('Com Sensor', v_cat_id, v_user_id), 
        ('Sem Sensor', v_cat_id, v_user_id)
    ON CONFLICT DO NOTHING;

    -- Kit Simples
    INSERT INTO public.categories (name, "key", user_id) VALUES ('⚡ Kit Simples', 'simples', v_user_id) 
    ON CONFLICT ("key") DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_id;
    INSERT INTO public.subcategories (name, category_id, user_id) VALUES 
        ('Motor Econômico', v_cat_id, v_user_id), 
        ('Kit Essencial', v_cat_id, v_user_id)
    ON CONFLICT DO NOTHING;

    -- Mercedes Sprinter
    INSERT INTO public.categories (name, "key", user_id) VALUES ('🚐 Mercedes Sprinter', 'mercedes-sprinter', v_user_id) 
    ON CONFLICT ("key") DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_id;
    INSERT INTO public.subcategories (name, category_id, user_id) VALUES 
        ('Modelo 2013 em diante', v_cat_id, v_user_id), 
        ('Modelo até 2012', v_cat_id, v_user_id)
    ON CONFLICT DO NOTHING;

    -- Fiat Ducato
    INSERT INTO public.categories (name, "key", user_id) VALUES ('🚐 Fiat Ducato', 'fiat-ducato', v_user_id) 
    ON CONFLICT ("key") DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_id;
    INSERT INTO public.subcategories (name, category_id, user_id) VALUES 
        ('Com Sensor', v_cat_id, v_user_id), 
        ('Sem Sensor', v_cat_id, v_user_id),
        ('ABNT', v_cat_id, v_user_id)
    ON CONFLICT DO NOTHING;

    -- Acessórios
    INSERT INTO public.categories (name, "key", user_id) VALUES ('🔧 Acessório', 'acessorio', v_user_id) 
    ON CONFLICT ("key") DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_id;
    INSERT INTO public.subcategories (name, category_id, user_id) VALUES 
        ('Motores', v_cat_id, v_user_id), 
        ('Sensores', v_cat_id, v_user_id),
        ('Cremalheira', v_cat_id, v_user_id),
        ('Controle', v_cat_id, v_user_id)
    ON CONFLICT DO NOTHING;

    -- Peças & Consumíveis
    INSERT INTO public.categories (name, "key", user_id) VALUES ('📦 Peças & Consumíveis', 'consumivel', v_user_id) 
    ON CONFLICT ("key") DO UPDATE SET name = EXCLUDED.name RETURNING id INTO v_cat_id;
    INSERT INTO public.subcategories (name, category_id, user_id) VALUES 
        ('Óleo', v_cat_id, v_user_id), 
        ('Limpador', v_cat_id, v_user_id),
        ('Graxa', v_cat_id, v_user_id),
        ('Filtro', v_cat_id, v_user_id)
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Sincronização de categorias concluída com sucesso!';
END $$;
