import Link from "next/link";

/** Root fallback when no locale segment is available. Prefer `[locale]/not-found`. */
export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-6 text-[#f5f7ff]">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#7b7eff]">404</p>
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p className="text-sm text-[#9aa3b8]">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/en"
              className="inline-flex rounded-full bg-[#7b7eff] px-5 py-2.5 text-sm font-semibold text-[#06060b]"
            >
              English home
            </Link>
            <Link
              href="/fa"
              className="inline-flex rounded-full border border-[#7b7eff]/50 px-5 py-2.5 text-sm font-semibold text-[#f5f7ff]"
            >
              خانه فارسی
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
