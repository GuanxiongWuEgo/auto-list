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
    <div style={{ background: "#000000", minHeight: "100vh" }}>

      {/* Page header */}
      <div style={{ paddingTop: "120px", paddingBottom: "56px", paddingLeft: "40px", paddingRight: "40px", borderBottom: "1px solid #202020" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#7d7d7d", marginBottom: "16px" }}>
            Manufacturers
          </p>
          <h1 className="display-section" style={{ color: "#ffffff", margin: 0 }}>
            Brands
          </h1>
          <p style={{ fontSize: "14px", color: "#7d7d7d", marginTop: "16px" }}>
            Explore the world&apos;s most exclusive supercar manufacturers
          </p>
        </div>
      </div>

      {/* Brand grid */}
      {brands && brands.length > 0 ? (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2px 40px 80px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "2px",
            }}
          >
            {brands.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}`}
                className="dark-card"
                style={{ padding: "32px" }}
              >
                {brand.logo_url ? (
                  <img
                    src={brand.logo_url}
                    alt={`${brand.name_en} logo`}
                    style={{ height: "56px", width: "56px", objectFit: "contain", marginBottom: "20px" }}
                  />
                ) : (
                  <div
                    style={{
                      height: "56px",
                      width: "56px",
                      background: "#202020",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "20px",
                      fontSize: "24px",
                      fontWeight: 400,
                      color: "#FFC000",
                      textTransform: "uppercase",
                    }}
                  >
                    {brand.name_en.charAt(0)}
                  </div>
                )}

                <h2
                  style={{
                    fontSize: "20px",
                    fontWeight: 400,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: "#ffffff",
                    margin: "0 0 4px",
                  }}
                >
                  {brand.name_en}
                </h2>
                {brand.name_zh && (
                  <p style={{ fontSize: "12px", color: "#7d7d7d", margin: "0 0 8px" }}>{brand.name_zh}</p>
                )}

                <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#494949", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "16px" }}>
                  {brand.country && <span>{brand.country}</span>}
                  {brand.founded_year && <span>Est. {brand.founded_year}</span>}
                </div>

                {brand.description_en && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#7d7d7d",
                      margin: "0 0 20px",
                      lineHeight: "1.6",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {brand.description_en}
                  </p>
                )}

                <div style={{ width: "24px", height: "2px", background: "#FFC000" }} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
          <p style={{ color: "#494949", textTransform: "uppercase", letterSpacing: "2px", fontSize: "12px" }}>
            No brands yet. Check back soon.
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
