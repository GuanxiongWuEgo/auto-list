import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE_URL = "https://auto-list-rosy.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/compare`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/search`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Brand pages
  const { data: brands } = await supabase.from("brands").select("slug");
  const brandPages: MetadataRoute.Sitemap = (brands ?? []).map((b) => ({
    url: `${BASE_URL}/brands/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Car detail pages
  const { data: variants } = await supabase
    .from("car_variants")
    .select("slug, car_series(brands(slug))");
  const carPages: MetadataRoute.Sitemap = (variants ?? []).map((v) => {
    const brandSlug = (v.car_series as any)?.brands?.slug ?? v.slug.split("-")[0];
    return {
      url: `${BASE_URL}/brands/${brandSlug}/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [...staticPages, ...brandPages, ...carPages];
}
