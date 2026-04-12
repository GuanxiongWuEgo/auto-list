import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brands",
};

export default async function BrandsPage() {
  const supabase = await createClient();

  const { data: brands } = await supabase
    .from("brands")
    .select("slug, name_en, name_zh, country, founded_year, description_en, cover_url, logo_url")
    .order("name_en");

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Brands</h1>
      <p className="mt-2 text-muted">
        Explore the world&apos;s most exclusive supercar manufacturers
      </p>

      {brands && brands.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={`${brand.name_en} logo`}
                  className="h-16 w-16 rounded-full object-contain bg-background p-2"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-2xl font-bold text-accent">
                  {brand.name_en.charAt(0)}
                </div>
              )}
              <h2 className="mt-4 text-xl font-semibold group-hover:text-accent transition-colors">
                {brand.name_en}
              </h2>
              {brand.name_zh && (
                <p className="text-sm text-muted">{brand.name_zh}</p>
              )}
              <div className="mt-2 flex gap-3 text-xs text-muted">
                {brand.country && <span>{brand.country}</span>}
                {brand.founded_year && (
                  <span>Est. {brand.founded_year}</span>
                )}
              </div>
              {brand.description_en && (
                <p className="mt-3 text-sm text-muted line-clamp-3">
                  {brand.description_en}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-20 text-center">
          <p className="text-muted">No brands yet. Check back soon.</p>
        </div>
      )}
    </div>
  );
}
