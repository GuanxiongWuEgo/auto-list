import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const supabase = await createClient();
  const { data: brand } = await supabase
    .from("brands")
    .select("name_en, name_zh")
    .eq("slug", brandSlug)
    .single();

  if (!brand) return { title: "Brand Not Found" };
  return {
    title: `${brand.name_en}${brand.name_zh ? ` · ${brand.name_zh}` : ""}`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { brand: brandSlug } = await params;
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", brandSlug)
    .single();

  if (!brand) notFound();

  const { data: seriesList } = await supabase
    .from("car_series")
    .select("id, slug, name_en, name_zh, production_start, production_end, description_en")
    .eq("brand_id", brand.id)
    .order("production_start");

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
    <div style={{ background: "#000000", minHeight: "100vh" }}>

      {/* Brand hero header */}
      <div
        style={{
          paddingTop: "120px",
          paddingBottom: "56px",
          paddingLeft: "40px",
          paddingRight: "40px",
          borderBottom: "1px solid #202020",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {brand.cover_url && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${brand.cover_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.08,
            }}
          />
        )}

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <Link
              href="/brands"
              style={{ fontSize: "11px", color: "#7d7d7d", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase" }}
            >
              Brands
            </Link>
            <span style={{ color: "#494949", fontSize: "11px" }}>/</span>
            <span style={{ fontSize: "11px", color: "#ffffff", letterSpacing: "1px", textTransform: "uppercase" }}>
              {brand.name_en}
            </span>
          </nav>

          {/* Logo + name */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "24px" }}>
            {brand.logo_url ? (
              <img
                src={brand.logo_url}
                alt={`${brand.name_en} logo`}
                style={{ height: "64px", width: "64px", objectFit: "contain", flexShrink: 0 }}
              />
            ) : (
              <div
                style={{
                  height: "64px",
                  width: "64px",
                  background: "#202020",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 400,
                  color: "#FFC000",
                  textTransform: "uppercase",
                  flexShrink: 0,
                }}
              >
                {brand.name_en.charAt(0)}
              </div>
            )}

            <div>
              <h1
                style={{
                  fontSize: "clamp(32px, 5vw, 72px)",
                  fontWeight: 400,
                  textTransform: "uppercase",
                  lineHeight: 1,
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                {brand.name_en}
              </h1>
              {brand.name_zh && (
                <p style={{ fontSize: "16px", color: "#7d7d7d", margin: "8px 0 0" }}>{brand.name_zh}</p>
              )}
            </div>
          </div>

          {/* Meta badges */}
          <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
            {brand.country && <span className="badge">{brand.country}</span>}
            {brand.founded_year && <span className="badge">Est. {brand.founded_year}</span>}
          </div>

          {brand.description_en && (
            <p style={{ fontSize: "14px", color: "#7d7d7d", lineHeight: "1.7", maxWidth: "640px", marginTop: "24px" }}>
              {brand.description_en}
            </p>
          )}
        </div>
      </div>

      {/* Series + Variants */}
      {seriesList && seriesList.length > 0 ? (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px 80px" }}>
          {seriesList.map((series) => {
            const sv = variantsBySeries.get(series.id) ?? [];
            return (
              <section key={series.slug} style={{ paddingTop: "64px" }}>
                <div style={{ borderBottom: "1px solid #202020", paddingBottom: "20px", marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "16px", flexWrap: "wrap" }}>
                    <h2
                      style={{
                        fontSize: "clamp(20px, 3vw, 36px)",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        color: "#ffffff",
                        margin: 0,
                        letterSpacing: "0.5px",
                      }}
                    >
                      {series.name_en}
                    </h2>
                    {series.name_zh && (
                      <span style={{ fontSize: "13px", color: "#7d7d7d" }}>{series.name_zh}</span>
                    )}
                  </div>
                  <p style={{ fontSize: "11px", color: "#494949", letterSpacing: "1px", textTransform: "uppercase", marginTop: "8px" }}>
                    {series.production_start}
                    {series.production_end ? `–${series.production_end}` : "–Present"}
                  </p>
                  {series.description_en && (
                    <p style={{ fontSize: "13px", color: "#7d7d7d", lineHeight: "1.6", maxWidth: "560px", marginTop: "12px" }}>
                      {series.description_en}
                    </p>
                  )}
                </div>

                {sv.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                      gap: "2px",
                    }}
                  >
                    {sv.map((car) => (
                      <Link
                        key={car.slug}
                        href={`/brands/${brandSlug}/${car.slug}`}
                        className="dark-card group-card"
                      >
                        {car.cover_image_url ? (
                          <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                            <img
                              src={car.cover_image_url}
                              alt={car.name_en}
                              className="group-img"
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              aspectRatio: "16/9",
                              background: "#202020",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: "36px", fontWeight: 400, color: "#494949", textTransform: "uppercase" }}>
                              {car.name_en.charAt(0)}
                            </span>
                          </div>
                        )}

                        <div style={{ padding: "16px 20px 20px" }}>
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
                            <p style={{ fontSize: "11px", color: "#7d7d7d", margin: "0 0 10px" }}>{car.name_zh}</p>
                          )}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "11px", color: "#7d7d7d" }}>
                            {car.year && <span>{car.year}</span>}
                            {car.max_power_hp && (
                              <span style={{ color: "#FFC000" }}>{car.max_power_hp} HP</span>
                            )}
                            {car.top_speed_kmh && <span>{car.top_speed_kmh} KM/H</span>}
                            {car.weight_kg && <span>{car.weight_kg} KG</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "12px", color: "#494949", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Coming soon — variants being added.
                  </p>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "40vh" }}>
          <p style={{ color: "#494949", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px" }}>
            Coming soon — series data being added for {brand.name_en}.
          </p>
        </div>
      )}

      <footer style={{ background: "#181818", borderTop: "1px solid #202020", padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "11px", color: "#494949", letterSpacing: "1px", textTransform: "uppercase" }}>
          超跑百科 — Supercar Wiki
        </p>
      </footer>
    </div>
  );
}
