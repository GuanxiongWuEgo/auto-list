/**
 * Seed script — reads JSON from scripts/seed-data/ and upserts to Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment"
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface VariantData {
  slug: string;
  name_en: string;
  name_zh?: string;
  description_en?: string;
  description_zh?: string;
  year?: number;
  engine_layout?: string;
  displacement_cc?: number;
  cylinders?: number;
  forced_induction?: string;
  max_power_hp?: number;
  max_torque_nm?: number;
  zero_to_100_s?: number;
  top_speed_kmh?: number;
  weight_kg?: number;
  units_produced?: number;
  msrp_usd?: number;
  cover_image_url?: string | null;
  image_urls?: string[];
}

interface SeriesData {
  slug: string;
  name_en: string;
  name_zh?: string;
  production_start?: number;
  production_end?: number | null;
  description_en?: string;
  description_zh?: string;
  variants: VariantData[];
}

interface BrandFile {
  brand: {
    slug: string;
    name_en: string;
    name_zh?: string;
    country?: string;
    founded_year?: number;
    logo_url?: string | null;
    cover_url?: string | null;
    description_en?: string;
    description_zh?: string;
  };
  series: SeriesData[];
}

async function seedFile(filePath: string) {
  const raw = readFileSync(filePath, "utf-8");
  const data: BrandFile = JSON.parse(raw);

  console.log(`Seeding brand: ${data.brand.name_en}`);

  // Upsert brand
  const { data: brand, error: brandError } = await supabase
    .from("brands")
    .upsert(data.brand, { onConflict: "slug" })
    .select("id")
    .single();

  if (brandError || !brand) {
    console.error(`Failed to upsert brand ${data.brand.slug}:`, brandError);
    process.exit(1);
  }

  console.log(`  Brand ${data.brand.slug} → ${brand.id}`);

  for (const series of data.series) {
    const { variants, ...seriesRow } = series;

    // Upsert series
    const { data: seriesResult, error: seriesError } = await supabase
      .from("car_series")
      .upsert({ ...seriesRow, brand_id: brand.id }, { onConflict: "slug" })
      .select("id")
      .single();

    if (seriesError || !seriesResult) {
      console.error(`Failed to upsert series ${series.slug}:`, seriesError);
      process.exit(1);
    }

    console.log(`  Series ${series.slug} → ${seriesResult.id}`);

    // Upsert variants
    for (const variant of variants) {
      const { error: variantError } = await supabase
        .from("car_variants")
        .upsert(
          { ...variant, series_id: seriesResult.id },
          { onConflict: "slug" }
        );

      if (variantError) {
        console.error(
          `Failed to upsert variant ${variant.slug}:`,
          variantError
        );
        process.exit(1);
      }

      console.log(`    Variant ${variant.slug} ✓`);
    }
  }

  console.log(`Done: ${data.brand.name_en}\n`);
}

async function main() {
  const seedDir = join(__dirname, "seed-data");
  const files = readdirSync(seedDir).filter((f) => f.endsWith(".json"));

  if (files.length === 0) {
    console.error("No JSON files found in scripts/seed-data/");
    process.exit(1);
  }

  for (const file of files) {
    await seedFile(join(seedDir, file));
  }

  console.log("All seed data loaded successfully.");
}

main();
