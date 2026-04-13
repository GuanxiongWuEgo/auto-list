import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        background: "#000000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center",
      }}
    >
      {/* 404 numeral */}
      <p
        style={{
          fontSize: "120px",
          fontWeight: 400,
          lineHeight: 0.92,
          textTransform: "uppercase",
          color: "#202020",
          margin: "0 0 32px",
          letterSpacing: "-4px",
        }}
      >
        404
      </p>

      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 54px)",
          fontWeight: 400,
          textTransform: "uppercase",
          color: "#ffffff",
          margin: "0 0 16px",
          letterSpacing: "-0.5px",
        }}
      >
        Page Not Found
      </h1>

      <p style={{ fontSize: "14px", color: "#7d7d7d", marginBottom: "40px" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" className="btn-gold">
          Go Home
        </Link>
        <Link href="/search" className="btn-ghost">
          Search
        </Link>
      </div>
    </div>
  );
}
