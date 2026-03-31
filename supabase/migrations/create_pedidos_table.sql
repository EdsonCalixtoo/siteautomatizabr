-- =========================================================
-- TABELA: pedidos
-- Execute este SQL no Supabase > SQL Editor
-- =========================================================

create table if not exists public.pedidos (
  id            uuid primary key default gen_random_uuid(),
  
  -- Cliente
  cliente_nome      text not null,
  cliente_email     text not null,
  cliente_telefone  text,
  
  -- Endereço (JSON)
  endereco          jsonb,
  
  -- Itens do pedido (JSON array)
  itens             jsonb not null default '[]',
  
  -- Valores
  subtotal          numeric(10,2) not null default 0,
  frete             numeric(10,2) not null default 0,
  desconto          numeric(10,2) not null default 0,
  total             numeric(10,2) not null default 0,
  cupom             text,
  
  -- Pagamento
  metodo_pagamento  text not null default 'pix',  -- 'pix' | 'cartao'
  status            text not null default 'aguardando_pagamento',
                    -- 'aguardando_pagamento' | 'pago' | 'cancelado'
  mp_payment_id     text,           -- ID do pagamento no Mercado Pago
  pix_code          text,           -- Código copia e cola
  pix_qrcode        text,           -- QR Code em base64
  tipo_entrega      text not null default 'entrega',
  ano_veiculo       text,
  
  -- Timestamps
  data_criacao      timestamptz not null default now(),
  data_pagamento    timestamptz
);

-- Índices para consultas frequentes
create index if not exists idx_pedidos_status on public.pedidos(status);
create index if not exists idx_pedidos_email  on public.pedidos(cliente_email);
create index if not exists idx_pedidos_mp_id  on public.pedidos(mp_payment_id);

-- RLS (Row Level Security)
alter table public.pedidos enable row level security;

-- Política: qualquer pessoa pode inserir (cliente fazendo pedido)
create policy "Clientes podem criar pedidos"
  on public.pedidos for insert
  with check (true);

-- Política: cada cliente vê apenas seus próprios pedidos
create policy "Clientes veem seus pedidos"
  on public.pedidos for select
  using (true);  -- Ajustar se quiser restringir por email autenticado

-- Política: apenas service_role pode atualizar (webhook)
create policy "Service role pode atualizar pedidos"
  on public.pedidos for update
  using (true);

-- =========================================================
-- VERIFICAR: Rodar após criar a tabela
-- =========================================================
-- select * from public.pedidos limit 5;
