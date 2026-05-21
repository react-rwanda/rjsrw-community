import Link from "next/link";

// The (auth) route group renders centered card pages on a neutral background.
// Does NOT inherit the public navbar — auth flows have their own minimal chrome.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="h-16 bg-neutral-0 border-b border-neutral-200">
        <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center">
          <Link
            href="/"
            className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-neutral-900 hover:opacity-80 transition-opacity"
          >
            React JS Rwanda
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      <footer className="py-6 text-center text-[11px] uppercase tracking-[0.06em] text-neutral-400">
        © 2024 React JS Rwanda · Built for the community by developers
      </footer>
    </main>
  );
}
