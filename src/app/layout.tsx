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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              超跑百科
            </Link>
            <div className="flex items-center gap-8">
              <Link
                href="/brands"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Brands
              </Link>
              <Link
                href="/compare"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Compare
              </Link>
              <Link
                href="/search"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Search
              </Link>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
