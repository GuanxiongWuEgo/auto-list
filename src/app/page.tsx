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
    <div style={{ background: "#000000" }}>

      {/* ── HERO — full viewport, absolute black ── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 40px",
          textAlign: "center",
          position: "relative",
          background: "#000000",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "#202020" }} />

        <div style={{ maxWidth: "900px" }}>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#7d7d7d",
              marginBottom: "32px",
            }}
          >
            The Definitive Supercar Encyclopedia
          </p>

          <h1
            className="display-hero"
            style={{ color: "#ffffff", marginBottom: "24px" }}
          >
            超跑百科
          </h1>

          <p
            style={{
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "1.56",
              color: "#7d7d7d",
              maxWidth: "480px",
              margin: "0 auto 48px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Browse every variant. Compare specs. Explore the lineage.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/brands" className="btn-gold">
              Explore Brands
            </Link>
            <Link href="/compare" className="btn-ghost">
              Compare Cars
            </Link>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "#202020",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            opacity: 0.4,
          }}
        >
          <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffffff" }}>
            Scroll
          </span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M6 0v16M1 11l5 5 5-5" stroke="white" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* ── MOST POWERFUL ── */}
      {featured && featured.length > 0 && (
        <section style={{ background: "#000000", padding: "80px 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ borderBottom: "1px solid #202020", paddingBottom: "24px", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#7d7d7d", marginBottom: "12px" }}>
                Performance
              </p>
              <h2 className="display-sub" style={{ color: "#ffffff" }}>
                Most Powerful
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "2px",
              }}
            >
              {featured.map((car) => (
                <Link
                  key={car.slug}
                  href={`/brands/${(car.car_series as any)?.brands?.slug ?? car.slug.split("-")[0]}/${car.slug}`}
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
                      <span style={{ fontSize: "48px", fontWeight: 400, color: "#494949", textTransform: "uppercase" }}>
                        {car.name_en.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div style={{ padding: "20px 24px 24px" }}>
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        color: "#ffffff",
                        margin: "0 0 4px",
                      }}
                    >
                      {car.name_en}
                    </h3>
                    {car.name_zh && (
                      <p style={{ fontSize: "12px", color: "#7d7d7d", margin: "0 0 12px" }}>{car.name_zh}</p>
                    )}
                    <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "#7d7d7d", letterSpacing: "0.5px" }}>
                      {car.year && <span>{car.year}</span>}
                      {car.max_power_hp && (
                        <span style={{ color: "#FFC000" }}>{car.max_power_hp} HP</span>
                      )}
                      {car.top_speed_kmh && <span>{car.top_speed_kmh} KM/H</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRANDS ── */}
      {brands && brands.length > 0 && (
        <section style={{ background: "#000000", padding: "80px 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ borderBottom: "1px solid #202020", paddingBottom: "24px", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#7d7d7d", marginBottom: "12px" }}>
                Manufacturers
              </p>
              <h2 className="display-sub" style={{ color: "#ffffff" }}>
                Brands
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2px",
              }}
            >
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}`}
                  className="dark-row"
                  style={{ padding: "24px 28px", gap: "20px" }}
                >
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={`${brand.name_en} logo`}
                      style={{ height: "48px", width: "48px", objectFit: "contain", flexShrink: 0 }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "48px",
                        width: "48px",
                        background: "#202020",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "20px",
                        fontWeight: 400,
                        color: "#FFC000",
                        textTransform: "uppercase",
                      }}
                    >
                      {brand.name_en.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "#ffffff",
                        margin: "0 0 4px",
                      }}
                    >
                      {brand.name_en}
                    </h3>
                    <p style={{ fontSize: "11px", color: "#7d7d7d", margin: 0, letterSpacing: "0.5px" }}>
                      {brand.name_zh}
                      {brand.country && ` · ${brand.country}`}
                    </p>
                  </div>
                  <svg
                    style={{ marginLeft: "auto", flexShrink: 0, opacity: 0.4 }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        style={{
          background: "#181818",
          borderTop: "1px solid #202020",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "11px", color: "#494949", letterSpacing: "1px", textTransform: "uppercase" }}>
          超跑百科 — Supercar Wiki · All specs for reference only
        </p>
      </footer>
    </div>
  );
}
