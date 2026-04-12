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
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted">
        <Link href="/brands" className="hover:text-foreground transition-colors">
          Brands
        </Link>
        <span>/</span>
        {brand && (
          <>
            <Link
              href={`/brands/${brand.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {brand.name_en}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{car.name_en}</span>
      </nav>

      {/* Hero */}
      <div className="mt-8">
        {car.cover_image_url ? (
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-card">
            <img
              src={car.cover_image_url}
              alt={car.name_en}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-card">
            <span className="text-6xl font-bold text-border">
              {car.name_en}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight">{car.name_en}</h1>
        {car.name_zh && car.name_zh !== car.name_en && (
          <p className="mt-1 text-lg text-muted">{car.name_zh}</p>
        )}
        <div className="mt-2 flex gap-4 text-sm text-muted">
          {car.year && <span>{car.year}</span>}
          {series && <span>{series.name_en} series</span>}
          {brand && <span>{brand.name_en}</span>}
        </div>
      </div>

      {/* Description */}
      {car.description_en && (
        <p className="mt-6 max-w-3xl leading-relaxed text-muted">
          {car.description_en}
        </p>
      )}
      {car.description_zh && (
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          {car.description_zh}
        </p>
      )}

      {/* Spec highlights */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {car.max_power_hp && (
          <div className="rounded-xl bg-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{car.max_power_hp}</p>
            <p className="text-xs text-muted">Horsepower</p>
          </div>
        )}
        {car.max_torque_nm && (
          <div className="rounded-xl bg-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{car.max_torque_nm}</p>
            <p className="text-xs text-muted">Nm Torque</p>
          </div>
        )}
        {car.zero_to_100_s && (
          <div className="rounded-xl bg-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{car.zero_to_100_s}s</p>
            <p className="text-xs text-muted">0–100 km/h</p>
          </div>
        )}
        {car.top_speed_kmh && (
          <div className="rounded-xl bg-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{car.top_speed_kmh}</p>
            <p className="text-xs text-muted">km/h Top Speed</p>
          </div>
        )}
      </div>

      {/* Full spec table */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Specifications</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {specRows.map(({ key, label, labelZh, suffix, prefix }) => {
                const value = (car as any)[key];
                if (value == null) return null;
                const formatted =
                  key === "msrp_usd"
                    ? `${prefix ?? ""}${Number(value).toLocaleString()}`
                    : `${prefix ?? ""}${value}${suffix ?? ""}`;
                return (
                  <tr key={key} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted">
                      {label}
                      <span className="ml-2 text-xs text-muted/60">{labelZh}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compare CTA */}
      <div className="mt-10 flex gap-4">
        <Link
          href={`/compare?a=${car.slug}`}
          className="rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-card"
        >
          Compare this car
        </Link>
        {brand && (
          <Link
            href={`/brands/${brand.slug}`}
            className="rounded-full border border-border px-5 py-2 text-sm transition-colors hover:bg-card"
          >
            More {brand.name_en} cars
          </Link>
        )}
      </div>
    </div>
  );
}
