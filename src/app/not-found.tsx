import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: { index: false, follow: true },
};

/** Root fallback when no locale segment is available. Prefer `[locale]/not-found`. */
export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[#0b0c10] px-6 text-[#ecedf0]">
        <div className="max-w-md space-y-4 text-center">
          <p className="text-sm font-semibold text-[#ff5470]">404</p>
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p className="text-sm text-[#9095a3]">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/en/"
              className="inline-flex bg-[#ff5470] px-5 py-2.5 text-sm font-semibold text-[#14151c]"
            >
              English home
            </Link>
            <Link
              href="/fa/"
              className="inline-flex border border-[#ff5470]/50 px-5 py-2.5 text-sm font-semibold text-[#ecedf0]"
            >
              خانه فارسی
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
