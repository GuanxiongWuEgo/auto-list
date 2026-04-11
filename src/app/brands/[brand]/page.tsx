import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: { brand: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name_en, name_zh")
    .eq("slug", params.brand)
    .single();

  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name_en}${brand.name_zh ? ` · ${brand.name_zh}` : ""}`,
  };
}

export default async function BrandPage({ params }: Props) {
  const supabase = createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", params.brand)
    .single();

  if (!brand) notFound();

  const { data: seriesList } = await supabase
    .from("car_series")
    .select("id, slug, name_en, name_zh, production_start, production_end, description_en")
    .eq("brand_id", brand.id)
    .order("production_start");

  // Fetch variants for each series
  const seriesIds = seriesList?.map((s) => s.id) ?? [];
  const { data: variants } = seriesIds.length
    ? await supabase
        .from("car_variants")
        .select(
          "slug, name_en, name_zh, year, max_power_hp, top_speed_kmh, weight_kg, cover_image_url, series_id"
        )
        .in("series_id", seriesIds)
        .order("year")
    : { data: [] };

  const variantsBySeries = new Map<string, typeof variants>();
  for (const v of variants ?? []) {
    const list = variantsBySeries.get(v.series_id) ?? [];
    list.push(v);
    variantsBySeries.set(v.series_id, list);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Brand header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-card text-2xl font-bold text-accent">
          {brand.name_en.charAt(0)}
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{brand.name_en}</h1>
          {brand.name_zh && <p className="text-lg text-muted">{brand.name_zh}</p>}
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-sm text-muted">
        {brand.country && <span>{brand.country}</span>}
        {brand.founded_year && <span>Founded {brand.founded_year}</span>}
      </div>
      {brand.description_en && (
        <p className="mt-4 max-w-3xl text-muted">{brand.description_en}</p>
      )}

      {/* Series */}
      {seriesList && seriesList.length > 0 ? (
        <div className="mt-12 space-y-16">
          {seriesList.map((series) => {
            const sv = variantsBySeries.get(series.id) ?? [];
            return (
              <section key={series.slug}>
                <div className="border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">{series.name_en}</h2>
                  {series.name_zh && (
                    <span className="text-sm text-muted"> {series.name_zh}</span>
                  )}
                  <div className="mt-1 text-sm text-muted">
                    {series.production_start}
                    {series.production_end
                      ? `–${series.production_end}`
                      : "–present"}
                  </div>
                  {series.description_en && (
                    <p className="mt-2 max-w-2xl text-sm text-muted">
                      {series.description_en}
                    </p>
                  )}
                </div>

                {sv.length > 0 ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sv.map((car) => (
                      <Link
                        key={car.slug}
                        href={`/brands/${params.brand}/${car.slug}`}
                        className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/50"
                      >
                        {car.cover_image_url ? (
                          <div className="aspect-video w-full overflow-hidden rounded-lg bg-background">
                            <img
                              src={car.cover_image_url}
                              alt={car.name_en}
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-background">
                            <span className="text-2xl font-bold text-border">
                              {car.name_en.charAt(0)}
                            </span>
                          </div>
                        )}
                        <h3 className="mt-3 font-semibold group-hover:text-accent transition-colors">
                          {car.name_en}
                        </h3>
                        {car.name_zh && car.name_zh !== car.name_en && (
                          <p className="text-sm text-muted">{car.name_zh}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                          {car.year && <span>{car.year}</span>}
                          {car.max_power_hp && <span>{car.max_power_hp} hp</span>}
                          {car.top_speed_kmh && (
                            <span>{car.top_speed_kmh} km/h</span>
                          )}
                          {car.weight_kg && <span>{car.weight_kg} kg</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-6 text-sm text-muted">
                    Coming soon — variants are being added.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-20 text-center">
          <p className="text-muted">
            Coming soon — series data is being added for {brand.name_en}.
          </p>
        </div>
      )}
    </div>
  );
}
