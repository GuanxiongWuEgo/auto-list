import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ brand: string; car: string }>;
}

const specRows: { key: string; label: string; labelZh: string; suffix?: string; prefix?: string }[] = [
  { key: "engine_layout", label: "Engine Layout", labelZh: "发动机布局" },
  { key: "displacement_cc", label: "Displacement", labelZh: "排量", suffix: " cc" },
  { key: "cylinders", label: "Cylinders", labelZh: "气缸数" },
  { key: "forced_induction", label: "Aspiration", labelZh: "进气方式" },
  { key: "max_power_hp", label: "Power", labelZh: "最大马力", suffix: " hp" },
  { key: "max_torque_nm", label: "Torque", labelZh: "最大扭矩", suffix: " Nm" },
  { key: "zero_to_100_s", label: "0–100 km/h", labelZh: "百公里加速", suffix: " s" },
  { key: "top_speed_kmh", label: "Top Speed", labelZh: "最高时速", suffix: " km/h" },
  { key: "weight_kg", label: "Weight", labelZh: "车重", suffix: " kg" },
  { key: "power_to_weight_hp_per_ton", label: "Power/Weight", labelZh: "推重比", suffix: " hp/ton" },
  { key: "units_produced", label: "Units Produced", labelZh: "产量", suffix: " units" },
  { key: "msrp_usd", label: "MSRP", labelZh: "建议零售价", prefix: "$" },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { car: carSlug } = await params;
  const supabase = await createClient();
  const { data: car } = await supabase
    .from("car_variants")
    .select("name_en, name_zh, max_power_hp, year")
    .eq("slug", carSlug)
    .single();

  if (!car) return { title: "Car Not Found" };
  return {
    title: `${car.name_en} (${car.year})`,
    description: `${car.name_en} — ${car.max_power_hp ?? "?"} hp supercar specs, photos, and details.`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { car: carSlug } = await params;
  const supabase = await createClient();

  const { data: car } = await supabase
    .from("car_variants")
    .select("*, series:car_series(slug, name_en, name_zh, brand:brands(slug, name_en, name_zh))")
    .eq("slug", carSlug)
    .single();

  if (!car) notFound();

  const brand = (car.series as any)?.brand;
  const series = car.series as any;

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }}>

      {/* Full-width hero image */}
      {car.cover_image_url ? (
        <div style={{ width: "100%", height: "70vh", position: "relative", overflow: "hidden" }}>
          <img
            src={car.cover_image_url}
            alt={car.name_en}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Dark gradient overlay bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))",
            }}
          />
          {/* Car name overlay on image */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "40px",
              right: "40px",
              zIndex: 2,
            }}
          >
            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 96px)",
                fontWeight: 400,
                textTransform: "uppercase",
                lineHeight: 0.92,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.5px",
              }}
            >
              {car.name_en}
            </h1>
          </div>
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "40vh",
            background: "#181818",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "80px",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 96px)",
              fontWeight: 400,
              textTransform: "uppercase",
              lineHeight: 0.92,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            {car.name_en}
          </h1>
        </div>
      )}

      {/* Content area */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 40px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "32px", marginBottom: "32px" }}>
          <Link href="/brands" style={{ fontSize: "11px", color: "#7d7d7d", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase" }}>
            Brands
          </Link>
          <span style={{ color: "#494949", fontSize: "11px" }}>/</span>
          {brand && (
            <>
              <Link
                href={`/brands/${brand.slug}`}
                style={{ fontSize: "11px", color: "#7d7d7d", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase" }}
              >
                {brand.name_en}
              </Link>
              <span style={{ color: "#494949", fontSize: "11px" }}>/</span>
            </>
          )}
          <span style={{ fontSize: "11px", color: "#ffffff", letterSpacing: "1px", textTransform: "uppercase" }}>
            {car.name_en}
          </span>
        </nav>

        {/* Car identity */}
        <div style={{ borderBottom: "1px solid #202020", paddingBottom: "32px" }}>
          {car.name_zh && car.name_zh !== car.name_en && (
            <p style={{ fontSize: "16px", color: "#7d7d7d", marginBottom: "12px" }}>{car.name_zh}</p>
          )}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {car.year && <span className="badge">{car.year}</span>}
            {series && <span className="badge">{series.name_en} Series</span>}
            {brand && <span className="badge">{brand.name_en}</span>}
          </div>
        </div>

        {/* Descriptions */}
        {(car.description_en || car.description_zh) && (
          <div style={{ padding: "32px 0", borderBottom: "1px solid #202020" }}>
            {car.description_en && (
              <p style={{ fontSize: "15px", color: "#7d7d7d", lineHeight: "1.7", maxWidth: "680px", margin: "0 0 16px" }}>
                {car.description_en}
              </p>
            )}
            {car.description_zh && (
              <p style={{ fontSize: "14px", color: "#7d7d7d", lineHeight: "1.7", maxWidth: "680px", margin: 0 }}>
                {car.description_zh}
              </p>
            )}
          </div>
        )}

        {/* Spec highlights — 4 key numbers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "2px",
            margin: "32px 0",
          }}
        >
          {car.max_power_hp && (
            <div style={{ background: "#181818", padding: "28px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "40px", fontWeight: 400, color: "#FFC000", margin: "0 0 6px", lineHeight: 1 }}>
                {car.max_power_hp}
              </p>
              <p style={{ fontSize: "11px", color: "#7d7d7d", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
                Horsepower
              </p>
            </div>
          )}
          {car.max_torque_nm && (
            <div style={{ background: "#181818", padding: "28px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "40px", fontWeight: 400, color: "#FFC000", margin: "0 0 6px", lineHeight: 1 }}>
                {car.max_torque_nm}
              </p>
              <p style={{ fontSize: "11px", color: "#7d7d7d", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
                Nm Torque
              </p>
            </div>
          )}
          {car.zero_to_100_s && (
            <div style={{ background: "#181818", padding: "28px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "40px", fontWeight: 400, color: "#FFC000", margin: "0 0 6px", lineHeight: 1 }}>
                {car.zero_to_100_s}<span style={{ fontSize: "20px" }}>s</span>
              </p>
              <p style={{ fontSize: "11px", color: "#7d7d7d", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
                0–100 km/h
              </p>
            </div>
          )}
          {car.top_speed_kmh && (
            <div style={{ background: "#181818", padding: "28px 24px", textAlign: "center" }}>
              <p style={{ fontSize: "40px", fontWeight: 400, color: "#FFC000", margin: "0 0 6px", lineHeight: 1 }}>
                {car.top_speed_kmh}
              </p>
              <p style={{ fontSize: "11px", color: "#7d7d7d", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>
                km/h Top Speed
              </p>
            </div>
          )}
        </div>

        {/* Full spec table */}
        <div style={{ marginTop: "40px" }}>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#7d7d7d",
              margin: "0 0 2px",
            }}
          >
            Specifications
          </h2>

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "2px" }}>
            <tbody>
              {specRows.map(({ key, label, labelZh, suffix, prefix }) => {
                const value = (car as any)[key];
                if (value == null) return null;
                const formatted =
                  key === "msrp_usd"
                    ? `${prefix ?? ""}${Number(value).toLocaleString()}`
                    : `${prefix ?? ""}${value}${suffix ?? ""}`;
                return (
                  <tr
                    key={key}
                    style={{ borderBottom: "1px solid #181818" }}
                  >
                    <td
                      style={{
                        padding: "14px 20px",
                        background: "#0d0d0d",
                        fontSize: "12px",
                        color: "#7d7d7d",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        width: "50%",
                      }}
                    >
                      {label}
                      <span style={{ marginLeft: "8px", color: "#494949", textTransform: "none", letterSpacing: 0 }}>
                        {labelZh}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 20px",
                        background: "#181818",
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "#ffffff",
                        textAlign: "right",
                      }}
                    >
                      {formatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* CTAs */}
        <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href={`/compare?a=${car.slug}`} className="btn-gold">
            Compare This Car
          </Link>
          {brand && (
            <Link href={`/brands/${brand.slug}`} className="btn-ghost">
              More {brand.name_en}
            </Link>
          )}
        </div>
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
