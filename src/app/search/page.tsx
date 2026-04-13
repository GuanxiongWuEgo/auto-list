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
    <div style={{ background: "#000000", minHeight: "100vh" }}>

      {/* Page header */}
      <div style={{ paddingTop: "120px", paddingBottom: "56px", paddingLeft: "40px", paddingRight: "40px", borderBottom: "1px solid #202020" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#7d7d7d", marginBottom: "16px" }}>
            Encyclopedia
          </p>
          <h1 className="display-section" style={{ color: "#ffffff", margin: "0 0 24px" }}>
            Search
          </h1>

          {/* Search input */}
          <div style={{ position: "relative" }}>
            {/* Search icon */}
            <svg
              style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              maxLength={200}
              placeholder="Search cars... e.g. Zonda, Huayra, V12"
              style={{
                width: "100%",
                background: "#181818",
                color: "#ffffff",
                border: "none",
                borderBottom: "1px solid #FFC000",
                borderRadius: 0,
                padding: "20px 20px 20px 56px",
                fontSize: "16px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <p style={{ fontSize: "11px", color: "#494949", letterSpacing: "0.5px", marginTop: "10px" }}>
            Find any supercar by name, series, or specs
          </p>
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 40px 80px" }}>
        {results.length > 0 && (
          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {results.map((car) => (
              <Link
                key={car.slug}
                href={`/brands/${car.slug.split("-")[0]}/${car.slug}`}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0",
                  background: "#181818",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#202020")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#181818")}
              >
                {/* Thumbnail */}
                {car.cover_image_url ? (
                  <div style={{ width: "120px", height: "80px", flexShrink: 0, overflow: "hidden" }}>
                    <img
                      src={car.cover_image_url}
                      alt={car.name_en}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: "120px",
                      height: "80px",
                      flexShrink: 0,
                      background: "#202020",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "24px", fontWeight: 400, color: "#494949", textTransform: "uppercase" }}>
                      {car.name_en.charAt(0)}
                    </span>
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: "16px 24px", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "#ffffff",
                      margin: "0 0 4px",
                    }}
                  >
                    {car.name_en}
                  </h3>
                  {car.name_zh && car.name_zh !== car.name_en && (
                    <p style={{ fontSize: "11px", color: "#7d7d7d", margin: "0 0 8px" }}>{car.name_zh}</p>
                  )}
                  <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#7d7d7d", letterSpacing: "0.3px" }}>
                    {car.year && <span>{car.year}</span>}
                    {car.max_power_hp && (
                      <span style={{ color: "#FFC000" }}>{car.max_power_hp} HP</span>
                    )}
                    {car.top_speed_kmh && <span>{car.top_speed_kmh} KM/H</span>}
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ padding: "0 20px", flexShrink: 0, opacity: 0.3 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {searched && results.length === 0 && (
          <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#494949", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
              No results for &ldquo;{query}&rdquo;
            </p>
            <p style={{ fontSize: "12px", color: "#494949" }}>
              Try a different search or{" "}
              <Link href="/brands" style={{ color: "#FFC000", textDecoration: "none" }}>
                browse brands
              </Link>
            </p>
          </div>
        )}

        {/* Placeholder when empty */}
        {!searched && (
          <div style={{ paddingTop: "60px", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: "#313131", textTransform: "uppercase", letterSpacing: "2px" }}>
              Type to search 100+ supercar variants
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: "#181818", borderTop: "1px solid #202020", padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#494949", letterSpacing: "1px", textTransform: "uppercase" }}>
          超跑百科 — Supercar Wiki
        </p>
      </footer>
    </div>
  );
}
