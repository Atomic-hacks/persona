create extension if not exists pgcrypto;

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  input jsonb not null,
  output jsonb not null,
  output_text text not null,
  created_at timestamptz not null default now(),
  view_count int not null default 0,
  remix_count int not null default 0
);

create index if not exists generations_created_at_idx on generations (created_at desc);
create index if not exists generations_type_idx on generations (type);
