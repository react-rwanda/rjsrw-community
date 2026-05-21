"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-error-600">
          Something went wrong
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-neutral-900">
          Unexpected error
        </h1>
        <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
          We hit a snag rendering this page. Try again — if the problem persists, drop a note in the{" "}
          <a href="https://github.com" className="text-primary-500 hover:text-primary-600">
            issue tracker
          </a>
          .
        </p>
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center h-11 px-6 bg-neutral-900 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
