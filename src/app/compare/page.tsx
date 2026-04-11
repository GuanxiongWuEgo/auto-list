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

function formatValue(
  value: unknown,
  prefix?: string,
  suffix?: string
): string {
  if (value == null) return "—";
  if (typeof value === "number" && prefix === "$")
    return `${prefix}${value.toLocaleString()}`;
  return `${prefix ?? ""}${value}${suffix ?? ""}`;
}

export default function ComparePage() {
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

  const supabase = createClient();

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

  // Same car guard
  if (isSameCar) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Pick a different car</h1>
        <p className="mt-2 text-muted">
          You&apos;re comparing the same car to itself. Select a different car
          for one of the slots.
        </p>
        <Link
          href="/compare"
          className="mt-6 inline-block rounded-full border border-border px-5 py-2 text-sm hover:bg-card"
        >
          Start over
        </Link>
      </div>
    );
  }

  // Selector UI
  const showSelector = !slugA || !slugB || errorA || errorB;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Compare</h1>
      <p className="mt-1 text-sm text-muted">
        Pick any two cars for a side-by-side spec comparison
      </p>

      {/* Selectors */}
      {showSelector && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {(["a", "b"] as const).map((side) => {
            const current = side === "a" ? slugA : slugB;
            const hasError = side === "a" ? errorA : errorB;
            return (
              <div key={side} className="rounded-xl border border-border bg-card p-4">
                <label className="block text-sm font-medium text-muted mb-2">
                  Car {side.toUpperCase()}
                </label>
                {hasError && (
                  <p className="mb-2 text-sm text-red-400">
                    Car not found. Try searching or pick from the list.
                  </p>
                )}
                <select
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
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
        <div className="mt-10 overflow-hidden rounded-xl border border-border">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-border bg-card">
            <div className="px-4 py-3 text-sm font-medium text-muted">Spec</div>
            <div className="px-4 py-3 text-center">
              <Link
                href={`/brands/${carA.slug.split("-")[0]}/${carA.slug}`}
                className="font-semibold hover:text-accent transition-colors"
              >
                {carA.name_en}
              </Link>
              {carA.year && (
                <p className="text-xs text-muted">{carA.year}</p>
              )}
            </div>
            <div className="px-4 py-3 text-center">
              <Link
                href={`/brands/${carB.slug.split("-")[0]}/${carB.slug}`}
                className="font-semibold hover:text-accent transition-colors"
              >
                {carB.name_en}
              </Link>
              {carB.year && (
                <p className="text-xs text-muted">{carB.year}</p>
              )}
            </div>
          </div>
          {/* Rows */}
          {specRows.map(({ key, label, suffix, prefix }) => {
            const valA = (carA as any)[key];
            const valB = (carB as any)[key];
            return (
              <div
                key={key}
                className="grid grid-cols-3 border-b border-border last:border-0 text-sm"
              >
                <div className="px-4 py-3 text-muted">{label}</div>
                <div className="px-4 py-3 text-center font-medium">
                  {formatValue(valA, prefix, suffix)}
                </div>
                <div className="px-4 py-3 text-center font-medium">
                  {formatValue(valB, prefix, suffix)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
