import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Error 404
        </p>
        <h1 className="mt-4 text-6xl sm:text-7xl font-black tracking-tight text-neutral-900">
          404
        </h1>
        <p className="mt-4 text-base text-neutral-500 leading-relaxed">
          We couldn&apos;t find that page. It may have been moved, renamed, or never existed.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center h-11 px-6 bg-neutral-900 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-700 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
