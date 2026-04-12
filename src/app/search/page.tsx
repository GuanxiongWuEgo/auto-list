"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SearchResult {
  slug: string;
  name_en: string;
  name_zh: string | null;
  year: number | null;
  max_power_hp: number | null;
  top_speed_kmh: number | null;
  cover_image_url: string | null;
}

const supabase = createClient();

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  async function handleSearch(q: string) {
    setQuery(q);
    if (q.trim().length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }

    setSearched(true);
    const { data } = await supabase
      .from("car_variants")
      .select("slug, name_en, name_zh, year, max_power_hp, top_speed_kmh, cover_image_url")
      .textSearch("search_vector", q.trim().split(/\s+/).join(" & "), {
        type: "plain",
      })
      .limit(20);

    setResults(data ?? []);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Search</h1>
      <p className="mt-1 text-sm text-muted">
        Find any supercar by name, series, or specs
      </p>

      <div className="mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          maxLength={200}
          placeholder="Search cars... e.g. Zonda, Huayra, V12"
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted/50 focus:border-accent/50 focus:outline-none"
        />
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8 space-y-3">
          {results.map((car) => (
            <Link
              key={car.slug}
              href={`/brands/${car.slug.split("-")[0]}/${car.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/50"
            >
              {car.cover_image_url ? (
                <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-background">
                  <img
                    src={car.cover_image_url}
                    alt={car.name_en}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-background">
                  <span className="text-lg font-bold text-border">
                    {car.name_en.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h3 className="font-semibold group-hover:text-accent transition-colors">
                  {car.name_en}
                </h3>
                {car.name_zh && car.name_zh !== car.name_en && (
                  <p className="text-sm text-muted">{car.name_zh}</p>
                )}
                <div className="mt-1 flex gap-3 text-xs text-muted">
                  {car.year && <span>{car.year}</span>}
                  {car.max_power_hp && <span>{car.max_power_hp} hp</span>}
                  {car.top_speed_kmh && <span>{car.top_speed_kmh} km/h</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {searched && results.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-2 text-sm text-muted">
            Try a different search or{" "}
            <Link href="/brands" className="text-accent hover:underline">
              browse brands
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
