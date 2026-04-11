import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted">Page not found</p>
      <div className="mt-6 flex gap-4">
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-card"
        >
          Go home
        </Link>
        <Link
          href="/search"
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-card"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
