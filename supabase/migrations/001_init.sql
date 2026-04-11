-- 001_init.sql — Core tables for Supercar Wiki

-- Brands
create table brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_zh text,
  country text,
  founded_year int,
  logo_url text,
  cover_url text,
  description_en text,
  description_zh text,
  created_at timestamptz default now()
);

-- Car series (e.g. Zonda, Huayra)
create table car_series (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references brands(id) on delete cascade,
  slug text unique not null,
  name_en text not null,
  name_zh text,
  production_start int,
  production_end int,
  description_en text,
  description_zh text,
  created_at timestamptz default now()
);

-- Car variants (e.g. Zonda F, Zonda Cinque)
create table car_variants (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references car_series(id) on delete cascade,
  slug text unique not null,
  name_en text not null,
  name_zh text,
  description_en text,
  description_zh text,
  year int,
  -- Engine
  engine_layout text,
  displacement_cc int,
  cylinders int,
  forced_induction text,
  max_power_hp int,
  max_torque_nm int,
  -- Performance
  zero_to_100_s numeric(4,2),
  top_speed_kmh int,
  weight_kg int,
  power_to_weight_hp_per_ton numeric(5,1) generated always as (
    case when weight_kg > 0
      then round((max_power_hp * 1000.0 / weight_kg)::numeric, 1)
      else null
    end
  ) stored,
  -- Production
  units_produced int,
  msrp_usd int,
  -- Media
  cover_image_url text,
  image_urls text[],
  model_3d_url text,
  -- Search
  search_vector tsvector generated always as (
    to_tsvector('simple',
      coalesce(name_en, '') || ' ' ||
      coalesce(name_zh, '') || ' ' ||
      coalesce(description_en, '')
    )
  ) stored,
  created_at timestamptz default now()
);

-- Indexes
create index idx_car_series_brand on car_series(brand_id);
create index idx_car_variants_series on car_variants(series_id);
create index idx_car_variants_search on car_variants using gin(search_vector);
create index idx_car_variants_slug on car_variants(slug);
create index idx_brands_slug on brands(slug);

-- Row Level Security
alter table brands enable row level security;
alter table car_series enable row level security;
alter table car_variants enable row level security;

-- Public read-only policies
create policy "Public read brands" on brands for select using (true);
create policy "Public read car_series" on car_series for select using (true);
create policy "Public read car_variants" on car_variants for select using (true);
