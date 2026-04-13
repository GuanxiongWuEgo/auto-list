import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "超跑百科 — Supercar Wiki",
    template: "%s | 超跑百科",
  },
  description:
    "The definitive supercar encyclopedia. Browse every variant, compare specs side-by-side, explore the lineage of legendary hypercars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        style={{ background: "#000000", color: "#ffffff" }}
      >
        {/* Navigation — floating in darkness, transparent */}
        <nav
          className="fixed top-0 z-50 w-full"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            {/* Left — nav links */}
            <div className="flex items-center gap-8">
              <Link href="/brands" className="nav-link">
                Brands
              </Link>
              <Link href="/compare" className="nav-link">
                Compare
              </Link>
            </div>

            {/* Center — wordmark */}
            <Link
              href="/"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 400,
                letterSpacing: "3px",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              超跑百科
            </Link>

            {/* Right — search */}
            <div className="flex items-center">
              <Link
                href="/search"
                className="nav-link"
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                Search
              </Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}
