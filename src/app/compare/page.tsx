"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CarVariant {
  slug: string;
  name_en: string;
  name_zh: string | null;
  year: number | null;
  engine_layout: string | null;
  displacement_cc: number | null;
  cylinders: number | null;
  forced_induction: string | null;
  max_power_hp: number | null;
  max_torque_nm: number | null;
  zero_to_100_s: number | null;
  top_speed_kmh: number | null;
  weight_kg: number | null;
  power_to_weight_hp_per_ton: number | null;
  units_produced: number | null;
  msrp_usd: number | null;
  cover_image_url: string | null;
}

const specRows: { key: string; label: string; suffix?: string; prefix?: string }[] = [
  { key: "engine_layout", label: "Engine Layout" },
  { key: "displacement_cc", label: "Displacement", suffix: " cc" },
  { key: "cylinders", label: "Cylinders" },
  { key: "forced_induction", label: "Aspiration" },
  { key: "max_power_hp", label: "Power", suffix: " hp" },
  { key: "max_torque_nm", label: "Torque", suffix: " Nm" },
  { key: "zero_to_100_s", label: "0–100 km/h", suffix: " s" },
  { key: "top_speed_kmh", label: "Top Speed", suffix: " km/h" },
  { key: "weight_kg", label: "Weight", suffix: " kg" },
  { key: "power_to_weight_hp_per_ton", label: "Power/Weight", suffix: " hp/ton" },
  { key: "units_produced", label: "Units Produced" },
  { key: "msrp_usd", label: "MSRP", prefix: "$" },
];

function formatValue(value: unknown, prefix?: string, suffix?: string): string {
  if (value == null) return "—";
  if (typeof value === "number" && prefix === "$")
    return `${prefix}${value.toLocaleString()}`;
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

const supabase = createClient();

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slugA = searchParams.get("a");
  const slugB = searchParams.get("b");
  const isSameCar = slugA && slugB && slugA === slugB;

  const [carA, setCarA] = useState<CarVariant | null>(null);
  const [carB, setCarB] = useState<CarVariant | null>(null);
  const [allCars, setAllCars] = useState<{ slug: string; name_en: string; year: number | null }[]>([]);
  const [errorA, setErrorA] = useState(false);
  const [errorB, setErrorB] = useState(false);

  useEffect(() => {
    supabase
      .from("car_variants")
      .select("slug, name_en, year")
      .order("name_en")
      .then(({ data }) => setAllCars(data ?? []));
  }, []);

  useEffect(() => {
    if (slugA && !isSameCar) {
      supabase
        .from("car_variants")
        .select("*")
        .eq("slug", slugA)
        .single()
        .then(({ data, error }) => {
          if (error || !data) setErrorA(true);
          else setCarA(data);
        });
    }
    if (slugB && !isSameCar) {
      supabase
        .from("car_variants")
        .select("*")
        .eq("slug", slugB)
        .single()
        .then(({ data, error }) => {
          if (error || !data) setErrorB(true);
          else setCarB(data);
        });
    }
  }, [slugA, slugB, isSameCar]);

  function selectCar(side: "a" | "b", slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(side, slug);
    router.push(`/compare?${params.toString()}`);
  }

  if (isSameCar) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 400,
            textTransform: "uppercase",
            color: "#ffffff",
            margin: "0 0 16px",
          }}
        >
          Pick a Different Car
        </h1>
        <p style={{ fontSize: "14px", color: "#7d7d7d", marginBottom: "32px" }}>
          You&apos;re comparing the same car to itself.
        </p>
        <Link href="/compare" className="btn-ghost">
          Start Over
        </Link>
      </div>
    );
  }

  const showSelector = !slugA || !slugB || errorA || errorB;

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ paddingTop: "120px", paddingBottom: "40px", paddingLeft: "40px", paddingRight: "40px", borderBottom: "1px solid #202020" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#7d7d7d", marginBottom: "12px" }}>
            Side-by-Side
          </p>
          <h1 className="display-section" style={{ color: "#ffffff", margin: 0 }}>
            Compare
          </h1>
          <p style={{ fontSize: "14px", color: "#7d7d7d", marginTop: "12px" }}>
            Pick any two cars for a side-by-side spec comparison
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 40px 80px" }}>

        {/* Selectors */}
        {showSelector && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "2px",
              marginTop: "40px",
            }}
          >
            {(["a", "b"] as const).map((side) => {
              const current = side === "a" ? slugA : slugB;
              const hasError = side === "a" ? errorA : errorB;
              return (
                <div key={side} style={{ background: "#181818", padding: "28px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 400,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "#7d7d7d",
                      marginBottom: "16px",
                    }}
                  >
                    Car {side.toUpperCase()}
                  </label>
                  {hasError && (
                    <p style={{ fontSize: "12px", color: "#FFC000", marginBottom: "12px" }}>
                      Car not found. Try searching or pick from the list.
                    </p>
                  )}
                  <select
                    style={{
                      width: "100%",
                      background: "#000000",
                      color: "#ffffff",
                      border: "1px solid #202020",
                      borderRadius: 0,
                      padding: "12px 16px",
                      fontSize: "13px",
                      appearance: "none",
                      cursor: "pointer",
                    }}
                    value={current ?? ""}
                    onChange={(e) => selectCar(side, e.target.value)}
                  >
                    <option value="">Select a car...</option>
                    {allCars.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name_en} {c.year ? `(${c.year})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        )}

        {/* Comparison table */}
        {carA && carB && (
          <div style={{ marginTop: "40px" }}>
            {/* Header row with car covers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", marginBottom: "2px" }}>
              {/* Spec label column header */}
              <div style={{ background: "#0d0d0d", padding: "20px", display: "flex", alignItems: "flex-end" }}>
                <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#494949" }}>
                  Spec
                </span>
              </div>

              {/* Car A header */}
              <div style={{ background: "#181818" }}>
                {carA.cover_image_url && (
                  <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <img src={carA.cover_image_url} alt={carA.name_en} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "16px 20px" }}>
                  <Link
                    href={`/brands/${carA.slug.split("-")[0]}/${carA.slug}`}
                    style={{ fontSize: "14px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.5px", color: "#ffffff", textDecoration: "none" }}
                  >
                    {carA.name_en}
                  </Link>
                  {carA.year && (
                    <p style={{ fontSize: "11px", color: "#7d7d7d", margin: "4px 0 0" }}>{carA.year}</p>
                  )}
                </div>
              </div>

              {/* Car B header */}
              <div style={{ background: "#181818" }}>
                {carB.cover_image_url && (
                  <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                    <img src={carB.cover_image_url} alt={carB.name_en} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "16px 20px" }}>
                  <Link
                    href={`/brands/${carB.slug.split("-")[0]}/${carB.slug}`}
                    style={{ fontSize: "14px", fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.5px", color: "#ffffff", textDecoration: "none" }}
                  >
                    {carB.name_en}
                  </Link>
                  {carB.year && (
                    <p style={{ fontSize: "11px", color: "#7d7d7d", margin: "4px 0 0" }}>{carB.year}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Spec rows */}
            {specRows.map(({ key, label, suffix, prefix }, idx) => {
              const valA = (carA as any)[key];
              const valB = (carB as any)[key];
              const isHigher = (a: unknown, b: unknown) =>
                typeof a === "number" && typeof b === "number" ? a > b : false;
              const aWins = isHigher(valA, valB);
              const bWins = isHigher(valB, valA);

              return (
                <div
                  key={key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "2px",
                    marginBottom: "2px",
                  }}
                >
                  {/* Label */}
                  <div
                    style={{
                      background: "#0d0d0d",
                      padding: "14px 20px",
                      fontSize: "12px",
                      color: "#7d7d7d",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {label}
                  </div>
                  {/* A value */}
                  <div
                    style={{
                      background: "#181818",
                      padding: "14px 20px",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: aWins ? "#FFC000" : "#ffffff",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {formatValue(valA, prefix, suffix)}
                  </div>
                  {/* B value */}
                  <div
                    style={{
                      background: "#181818",
                      padding: "14px 20px",
                      fontSize: "14px",
                      fontWeight: 400,
                      color: bWins ? "#FFC000" : "#ffffff",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {formatValue(valB, prefix, suffix)}
                  </div>
                </div>
              );
            })}

            {/* Change selection */}
            <div style={{ marginTop: "32px" }}>
              <button
                onClick={() => router.push("/compare")}
                className="btn-ghost"
                style={{ cursor: "pointer" }}
              >
                Change Selection
              </button>
            </div>
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

export default function ComparePage() {
  return (
    <Suspense>
      <CompareContent />
    </Suspense>
  );
}
