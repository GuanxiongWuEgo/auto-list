"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
      {/* Gold accent line */}
      <div style={{ width: "40px", height: "2px", background: "#FFC000", marginBottom: "32px" }} />

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
        Something Went Wrong
      </h1>

      <p style={{ fontSize: "14px", color: "#7d7d7d", marginBottom: "40px" }}>
        An unexpected error occurred. Please try again.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          className="btn-gold"
          style={{ cursor: "pointer" }}
        >
          Try Again
        </button>
        <Link href="/" className="btn-ghost">
          Go Home
        </Link>
      </div>
    </div>
  );
}
