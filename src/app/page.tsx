import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("slug, name_en, name_zh, country, cover_url, logo_url")
    .order("name_en");

  const { data: featured } = await supabase
    .from("car_variants")
    .select("slug, name_en, name_zh, year, max_power_hp, top_speed_kmh, cover_image_url, car_series(brands(slug))")
    .order("max_power_hp", { ascending: false })
    .limit(6);

  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            超跑百科
          </h1>
          <p className="mt-4 text-lg text-muted sm:text-xl">
            The definitive supercar encyclopedia
          </p>
          <p className="mt-2 text-sm text-muted">
            Browse every variant. Compare specs side-by-side. Explore the
            lineage.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link
              href="/brands"
              className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Explore Brands
            </Link>
            <Link
              href="/compare"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-card"
            >
              Compare Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      {featured && featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-2xl font-bold tracking-tight">
            Most Powerful
          </h2>
          <p className="mt-1 text-sm text-muted">
            The highest horsepower variants in our database
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car) => (
              <Link
                key={car.slug}
                href={`/brands/${(car.car_series as any)?.brands?.slug ?? car.slug.split("-")[0]}/${car.slug}`}
                className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
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
                    <span className="text-3xl font-bold text-border">
                      {car.name_en.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="mt-4 font-semibold group-hover:text-accent transition-colors">
                  {car.name_en}
                </h3>
                {car.name_zh && (
                  <p className="text-sm text-muted">{car.name_zh}</p>
                )}
                <div className="mt-3 flex gap-4 text-xs text-muted">
                  {car.year && <span>{car.year}</span>}
                  {car.max_power_hp && <span>{car.max_power_hp} hp</span>}
                  {car.top_speed_kmh && <span>{car.top_speed_kmh} km/h</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      {brands && brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="text-2xl font-bold tracking-tight">Brands</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/50"
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={`${brand.name_en} logo`}
                    className="h-12 w-12 rounded-full object-contain bg-background p-1"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-lg font-bold text-accent">
                    {brand.name_en.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold group-hover:text-accent transition-colors">
                    {brand.name_en}
                  </h3>
                  <p className="text-sm text-muted">
                    {brand.name_zh}
                    {brand.country && ` · ${brand.country}`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
