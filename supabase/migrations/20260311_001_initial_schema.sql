create extension if not exists pgcrypto;

create type public.user_role as enum (
  'JEFE',
  'RECEPCIONISTA',
  'PRODUCCION',
  'TIO_FRANCO',
  'CATERING'
);

create type public.event_status as enum (
  'POR_SENAR',
  'SENA_EN_PROCESO',
  'CONFIRMADO',
  'CANCELADO'
);

create type public.event_category as enum (
  'CASAMIENTO',
  'QUINCEANERA',
  'CUMPLEANOS',
  'CORPORATIVO',
  'EGRESADO',
  'OTRO'
);

create type public.currency_code as enum (
  'ARS',
  'USD'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role public.user_role not null,
  default_salon_id uuid references public.salons(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.catalog_services (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  currency public.currency_code not null,
  price_ars numeric(14,2),
  price_usd numeric(14,2),
  effective_from date,
  effective_label text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint catalog_services_price_presence_ck
    check (price_ars is not null or price_usd is not null),
  constraint catalog_services_currency_ck
    check (
      (currency = 'ARS' and price_ars is not null) or
      (currency = 'USD' and price_usd is not null)
    ),
  constraint catalog_services_name_category_uk unique (category, name)
);

create table if not exists public.service_bundles (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.service_bundle_items (
  bundle_id uuid not null references public.service_bundles(id) on delete cascade,
  service_id uuid not null references public.catalog_services(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (bundle_id, service_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid references public.salons(id) on delete set null,
  title text not null,
  category public.event_category not null,
  status public.event_status not null,
  event_date date not null,
  guest_count integer not null check (guest_count >= 0),
  total_amount numeric(14,2) not null default 0 check (total_amount >= 0),
  paid_amount numeric(14,2) not null default 0 check (paid_amount >= 0),
  balance_amount numeric(14,2) generated always as (total_amount - paid_amount) stored,
  created_by_user_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_role_active
  on public.profiles (role)
  where is_active = true;

create index if not exists idx_catalog_services_category_active
  on public.catalog_services (category)
  where is_active = true;

create index if not exists idx_events_event_date
  on public.events (event_date desc);

create index if not exists idx_events_status_date
  on public.events (status, event_date desc);

create index if not exists idx_events_category_date
  on public.events (category, event_date desc);

create index if not exists idx_events_salon_date
  on public.events (salon_id, event_date desc);

drop trigger if exists set_salons_updated_at on public.salons;
create trigger set_salons_updated_at
before update on public.salons
for each row
execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_catalog_services_updated_at on public.catalog_services;
create trigger set_catalog_services_updated_at
before update on public.catalog_services
for each row
execute function public.set_updated_at();

drop trigger if exists set_service_bundles_updated_at on public.service_bundles;
create trigger set_service_bundles_updated_at
before update on public.service_bundles
for each row
execute function public.set_updated_at();

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();

insert into public.salons (id, code, name)
values
  ('00000000-0000-0000-0000-000000000001', 'vicenzo', 'Vicenzo'),
  ('00000000-0000-0000-0000-000000000002', 'casita-san-javier', 'Casita San Javier')
on conflict (id) do update
set
  code = excluded.code,
  name = excluded.name,
  updated_at = timezone('utc', now());

insert into public.profiles (id, legacy_id, full_name, role, default_salon_id)
values
  ('10000000-0000-0000-0000-000000000001', '1', 'Franco', 'JEFE', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', '2', 'Julia', 'RECEPCIONISTA', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000003', '3', 'Hernán', 'PRODUCCION', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000004', '4', 'Tío Franco', 'TIO_FRANCO', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000005', '5', 'Catering (Bolognini)', 'CATERING', '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000006', '6', 'Orlando', 'JEFE', '00000000-0000-0000-0000-000000000001')
on conflict (id) do update
set
  legacy_id = excluded.legacy_id,
  full_name = excluded.full_name,
  role = excluded.role,
  default_salon_id = excluded.default_salon_id,
  updated_at = timezone('utc', now());

insert into public.catalog_services (
  legacy_id,
  category,
  name,
  currency,
  price_ars,
  price_usd,
  effective_from,
  effective_label
)
values
  ('t1', 'TÉCNICA & SONIDO', 'Alquiler Salón / Seña', 'ARS', 2000000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t2', 'TÉCNICA & SONIDO', 'Música, Luces y Pantallas / Seña', 'ARS', 1150000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t3', 'TÉCNICA & SONIDO', 'Cabina DJ con pantallas en pista', 'ARS', 130000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t4', 'TÉCNICA & SONIDO', 'Barras Láser Beam', 'ARS', 215000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t5', 'TÉCNICA & SONIDO', 'Craquera', 'ARS', 120000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t6', 'TÉCNICA & SONIDO', '12 Cabezales Aro LED', 'ARS', 210000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t7', 'TÉCNICA & SONIDO', 'Pantallas Laterales', 'ARS', 220000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t8', 'TÉCNICA & SONIDO', 'Pack Luces Premium', 'ARS', 740000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t9', 'TÉCNICA & SONIDO', 'Sonido para recepción exterior', 'ARS', 30000, null, '2025-03-01', 'Desde 01/03/25'),
  ('t10', 'TÉCNICA & SONIDO', 'Grupo Electrógeno', 'ARS', 500000, null, '2025-03-01', 'Desde 01/03/25'),
  ('f1', 'FUEGOS ARTIFICIALES', 'Fontanas escalera (por unidad)', 'USD', null, 100, '2025-03-01', 'Desde 01/03/25'),
  ('f2', 'FUEGOS ARTIFICIALES', 'Fontanas pista (por unidad)', 'USD', null, 115, '2025-03-01', 'Desde 01/03/25'),
  ('f3', 'FUEGOS ARTIFICIALES', 'Fontanas portón (por unidad)', 'USD', null, 115, '2025-03-01', 'Desde 01/03/25'),
  ('f4', 'FUEGOS ARTIFICIALES', 'Cascada', 'USD', null, 128, '2025-03-01', 'Desde 01/03/25'),
  ('c1', 'CATERING JÓVENES', 'Menú Jóvenes 15 años (por persona)', 'ARS', 53000, null, '2025-03-01', 'Desde 01/03/25'),
  ('c2', 'CATERING JÓVENES', 'Recepción tipo KFC (por persona)', 'ARS', 7700, null, '2025-03-01', 'Desde 01/03/25'),
  ('c3', 'CATERING JÓVENES', 'Barra de helados (por persona)', 'ARS', 7700, null, '2025-03-01', 'Desde 01/03/25'),
  ('c4', 'CATERING JÓVENES', 'Barra de tragos (por persona)', 'ARS', 4100, null, '2025-03-01', 'Desde 01/03/25'),
  ('c5', 'CATERING JÓVENES', 'Combo tragos + KFC (por persona)', 'ARS', 9500, null, '2025-03-01', 'Desde 01/03/25'),
  ('a1', 'MENÚ ADULTOS', 'Menú 1 Adultos (por persona)', 'ARS', 67000, null, '2025-03-01', 'Desde 01/03/25'),
  ('a2', 'MENÚ ADULTOS', 'Menú 2 Gourmet — pollo (por persona)', 'ARS', 75000, null, '2025-03-01', 'Desde 01/03/25'),
  ('a3', 'MENÚ ADULTOS', 'Menú 2 Gourmet — lomo (por persona)', 'ARS', 86000, null, '2025-03-01', 'Desde 01/03/25'),
  ('a4', 'MENÚ ADULTOS', 'Buffet 1 — 3 elementos (por persona)', 'ARS', 17500, null, '2025-03-01', 'Desde 01/03/25'),
  ('a5', 'MENÚ ADULTOS', 'Buffet 2 — 4 elementos (por persona)', 'ARS', 22500, null, '2025-03-01', 'Desde 01/03/25'),
  ('p1', 'PERSONAL', 'Mozo (por 12 hs)', 'ARS', 52000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d1', 'DECORACIÓN', 'Juego de living (por juego)', 'ARS', 35000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d2', 'DECORACIÓN', 'Mesas altas + banquetas (por juego)', 'ARS', 20000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d3', 'DECORACIÓN', 'Fundas de silla (por unidad)', 'ARS', 800, null, '2025-03-01', 'Desde 01/03/25'),
  ('d4', 'DECORACIÓN', 'Alas LED', 'ARS', 15000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d5', 'DECORACIÓN', 'Cortinas LED', 'ARS', 20000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d6', 'DECORACIÓN', 'Guirnaldas exterior', 'ARS', 20000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d7', 'DECORACIÓN', 'Buzón', 'ARS', 10000, null, '2025-03-01', 'Desde 01/03/25'),
  ('d8', 'DECORACIÓN', 'Cabina fotográfica (3 horas)', 'ARS', 100000, null, '2025-03-01', 'Desde 01/03/25'),
  ('tax1', 'IMPUESTOS', 'IVA', 'ARS', 200000, null, '2025-03-01', 'Desde 01/03/25')
on conflict (legacy_id) do update
set
  category = excluded.category,
  name = excluded.name,
  currency = excluded.currency,
  price_ars = excluded.price_ars,
  price_usd = excluded.price_usd,
  effective_from = excluded.effective_from,
  effective_label = excluded.effective_label,
  updated_at = timezone('utc', now());

insert into public.service_bundles (code, name)
values
  ('pack-premium', 'Pack Premium')
on conflict (code) do update
set
  name = excluded.name,
  updated_at = timezone('utc', now());

insert into public.service_bundle_items (bundle_id, service_id)
select
  bundle.id,
  service.id
from public.service_bundles bundle
join public.catalog_services service
  on service.legacy_id in ('t3', 't4', 't5', 't6', 't7')
where bundle.code = 'pack-premium'
on conflict do nothing;

insert into public.events (
  legacy_id,
  salon_id,
  title,
  category,
  status,
  event_date,
  guest_count,
  total_amount,
  paid_amount,
  created_by_user_id
)
values
  ('1', '00000000-0000-0000-0000-000000000001', 'Casamiento Rodríguez-Pérez', 'CASAMIENTO', 'CONFIRMADO', '2026-03-01', 200, 15000000, 15000000, '10000000-0000-0000-0000-000000000001'),
  ('2', '00000000-0000-0000-0000-000000000001', 'Quinceañera Valentina Suárez', 'QUINCEANERA', 'SENA_EN_PROCESO', '2026-03-07', 160, 18200000, 13400000, '10000000-0000-0000-0000-000000000002'),
  ('3', '00000000-0000-0000-0000-000000000001', 'Cumpleaños Empresarial TechCorp', 'CORPORATIVO', 'SENA_EN_PROCESO', '2026-03-08', 180, 19800000, 19925000, '10000000-0000-0000-0000-000000000002'),
  ('4', '00000000-0000-0000-0000-000000000001', 'Quinceañera Isabella Torres', 'QUINCEANERA', 'POR_SENAR', '2026-03-14', 140, 16500000, 4100000, '10000000-0000-0000-0000-000000000002'),
  ('5', '00000000-0000-0000-0000-000000000001', 'Casamiento Moreno-Giuliani', 'CASAMIENTO', 'CONFIRMADO', '2026-03-15', 220, 22800000, 22800000, '10000000-0000-0000-0000-000000000001'),
  ('6', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 50 — Roberto Paz', 'CUMPLEANOS', 'SENA_EN_PROCESO', '2026-03-21', 170, 14500000, 14545000, '10000000-0000-0000-0000-000000000002'),
  ('7', '00000000-0000-0000-0000-000000000001', 'Quinceañera Luciana Martínez', 'QUINCEANERA', 'CONFIRMADO', '2026-03-22', 190, 17800000, 16600000, '10000000-0000-0000-0000-000000000002'),
  ('8', '00000000-0000-0000-0000-000000000001', 'Casamiento Blanco-Fernández', 'CASAMIENTO', 'SENA_EN_PROCESO', '2026-03-29', 210, 21400000, 12500000, '10000000-0000-0000-0000-000000000001'),
  ('9', '00000000-0000-0000-0000-000000000001', 'Casamiento López-García', 'CASAMIENTO', 'CONFIRMADO', '2026-04-05', 180, 16000000, 16000000, '10000000-0000-0000-0000-000000000001'),
  ('10', '00000000-0000-0000-0000-000000000001', 'Quinceañera Sofía Méndez', 'QUINCEANERA', 'SENA_EN_PROCESO', '2026-04-12', 150, 17000000, 12000000, '10000000-0000-0000-0000-000000000002'),
  ('11', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 40 — Ana Ruiz', 'CUMPLEANOS', 'CONFIRMADO', '2026-04-19', 100, 8000000, 8000000, '10000000-0000-0000-0000-000000000002'),
  ('12', '00000000-0000-0000-0000-000000000001', 'Evento Corporativo Banco Macro', 'CORPORATIVO', 'POR_SENAR', '2026-04-25', 250, 25000000, 5000000, '10000000-0000-0000-0000-000000000002'),
  ('13', '00000000-0000-0000-0000-000000000001', 'Casamiento Pérez-Sánchez', 'CASAMIENTO', 'SENA_EN_PROCESO', '2026-05-03', 200, 20000000, 10000000, '10000000-0000-0000-0000-000000000001'),
  ('14', '00000000-0000-0000-0000-000000000001', 'Quinceañera Camila Fernández', 'QUINCEANERA', 'CONFIRMADO', '2026-05-10', 160, 18000000, 18000000, '10000000-0000-0000-0000-000000000002'),
  ('15', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 18 — Juan Pérez', 'CUMPLEANOS', 'SENA_EN_PROCESO', '2026-05-17', 120, 10000000, 6000000, '10000000-0000-0000-0000-000000000002'),
  ('16', '00000000-0000-0000-0000-000000000001', 'Evento Corporativo Google', 'CORPORATIVO', 'CONFIRMADO', '2026-05-24', 300, 30000000, 30000000, '10000000-0000-0000-0000-000000000001'),
  ('17', '00000000-0000-0000-0000-000000000001', 'Casamiento Gómez-Martínez', 'CASAMIENTO', 'POR_SENAR', '2026-06-07', 220, 22000000, 7000000, '10000000-0000-0000-0000-000000000002'),
  ('18', '00000000-0000-0000-0000-000000000001', 'Quinceañera Valentina López', 'QUINCEANERA', 'SENA_EN_PROCESO', '2026-06-14', 180, 19000000, 11000000, '10000000-0000-0000-0000-000000000002'),
  ('19', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 60 — María García', 'CUMPLEANOS', 'CONFIRMADO', '2026-06-21', 150, 12000000, 12000000, '10000000-0000-0000-0000-000000000002'),
  ('20', '00000000-0000-0000-0000-000000000001', 'Casamiento Ruiz-Sánchez', 'CASAMIENTO', 'SENA_EN_PROCESO', '2026-07-05', 200, 20000000, 10000000, '10000000-0000-0000-0000-000000000001'),
  ('21', '00000000-0000-0000-0000-000000000001', 'Quinceañera Sofía Pérez', 'QUINCEANERA', 'CONFIRMADO', '2026-07-12', 160, 18000000, 18000000, '10000000-0000-0000-0000-000000000002'),
  ('22', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 50 — Carlos Fernández', 'CUMPLEANOS', 'SENA_EN_PROCESO', '2026-08-02', 120, 10000000, 6000000, '10000000-0000-0000-0000-000000000002'),
  ('23', '00000000-0000-0000-0000-000000000001', 'Evento Corporativo Amazon', 'CORPORATIVO', 'CONFIRMADO', '2026-08-09', 300, 30000000, 30000000, '10000000-0000-0000-0000-000000000001'),
  ('24', '00000000-0000-0000-0000-000000000001', 'Casamiento Martínez-Gómez', 'CASAMIENTO', 'POR_SENAR', '2026-09-06', 220, 22000000, 7000000, '10000000-0000-0000-0000-000000000002'),
  ('25', '00000000-0000-0000-0000-000000000001', 'Quinceañera Valentina Ruiz', 'QUINCEANERA', 'SENA_EN_PROCESO', '2026-09-13', 180, 19000000, 11000000, '10000000-0000-0000-0000-000000000002'),
  ('26', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 40 — Ana López', 'CUMPLEANOS', 'CONFIRMADO', '2026-10-04', 100, 8000000, 8000000, '10000000-0000-0000-0000-000000000002'),
  ('27', '00000000-0000-0000-0000-000000000001', 'Evento Corporativo Facebook', 'CORPORATIVO', 'POR_SENAR', '2026-10-11', 250, 25000000, 5000000, '10000000-0000-0000-0000-000000000002'),
  ('28', '00000000-0000-0000-0000-000000000001', 'Casamiento Sánchez-Pérez', 'CASAMIENTO', 'SENA_EN_PROCESO', '2026-11-01', 200, 20000000, 10000000, '10000000-0000-0000-0000-000000000001'),
  ('29', '00000000-0000-0000-0000-000000000001', 'Quinceañera Camila Fernández', 'QUINCEANERA', 'CONFIRMADO', '2026-11-08', 160, 18000000, 18000000, '10000000-0000-0000-0000-000000000002'),
  ('30', '00000000-0000-0000-0000-000000000001', 'Cumpleaños 18 — Juan Ruiz', 'CUMPLEANOS', 'SENA_EN_PROCESO', '2026-12-06', 120, 10000000, 6000000, '10000000-0000-0000-0000-000000000002'),
  ('31', '00000000-0000-0000-0000-000000000001', 'Evento Corporativo Apple', 'CORPORATIVO', 'CONFIRMADO', '2026-12-13', 300, 30000000, 30000000, '10000000-0000-0000-0000-000000000001')
on conflict (legacy_id) do update
set
  salon_id = excluded.salon_id,
  title = excluded.title,
  category = excluded.category,
  status = excluded.status,
  event_date = excluded.event_date,
  guest_count = excluded.guest_count,
  total_amount = excluded.total_amount,
  paid_amount = excluded.paid_amount,
  created_by_user_id = excluded.created_by_user_id,
  updated_at = timezone('utc', now());

comment on table public.salons is 'Salones administrados por el sistema.';
comment on table public.profiles is 'Perfiles internos del sistema. En una segunda etapa puede vincularse con auth.users.';
comment on table public.catalog_services is 'Catálogo de servicios y precios base.';
comment on table public.service_bundles is 'Agrupadores de servicios compuestos, como Pack Premium.';
comment on table public.events is 'Eventos comerciales y operativos.';
