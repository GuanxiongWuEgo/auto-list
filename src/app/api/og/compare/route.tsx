import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slugA = searchParams.get("a");
  const slugB = searchParams.get("b");

  if (!slugA || !slugB) {
    return new Response("Missing a or b query params", { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [{ data: carA }, { data: carB }] = await Promise.all([
    supabase
      .from("car_variants")
      .select("name_en, year, max_power_hp, top_speed_kmh, zero_to_100_s, cover_image_url")
      .eq("slug", slugA)
      .single(),
    supabase
      .from("car_variants")
      .select("name_en, year, max_power_hp, top_speed_kmh, zero_to_100_s, cover_image_url")
      .eq("slug", slugB)
      .single(),
  ]);

  if (!carA || !carB) {
    return new Response("Car not found", { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#ededed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 24, color: "#d4a853", marginBottom: 32 }}>
          超跑百科 — Compare
        </div>
        <div
          style={{
            display: "flex",
            gap: 60,
            alignItems: "center",
          }}
        >
          {[carA, carB].map((car, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 400,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, textAlign: "center" }}>
                {car.name_en}
              </div>
              <div style={{ fontSize: 16, color: "#a3a3a3", marginTop: 4 }}>
                {car.year}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 20,
                  fontSize: 18,
                }}
              >
                {car.max_power_hp && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#d4a853" }}>
                      {car.max_power_hp}
                    </div>
                    <div style={{ fontSize: 12, color: "#a3a3a3" }}>HP</div>
                  </div>
                )}
                {car.top_speed_kmh && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#d4a853" }}>
                      {car.top_speed_kmh}
                    </div>
                    <div style={{ fontSize: 12, color: "#a3a3a3" }}>km/h</div>
                  </div>
                )}
                {car.zero_to_100_s && (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#d4a853" }}>
                      {car.zero_to_100_s}s
                    </div>
                    <div style={{ fontSize: 12, color: "#a3a3a3" }}>0-100</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 40,
            fontWeight: 700,
            color: "#262626",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          VS
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
