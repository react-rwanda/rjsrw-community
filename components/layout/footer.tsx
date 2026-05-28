// Public site footer — copyright left, nav links right.
// Rendered at the bottom of every (public) page via the layout.

import Link from "next/link";

const NAV_LINKS = [
  { label: "Documentation", href: "/library" },
  { label: "Code of Conduct", href: "/code-of-conduct" },
  { label: "GitHub", href: "https://github.com/react-rwanda", external: true },
  { label: "Contributing", href: "/contributing" },
  { label: "Twitter", href: "https://twitter.com/reactjsrwanda", external: true },
] as const;

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-neutral-0">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
        {/* Copyright */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
          © 2024 React JS Rwanda. Built for the community by developers.
        </p>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-8" aria-label="Footer navigation">
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 hover:text-neutral-900 transition-colors duration-[100ms] ease-out"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400 hover:text-neutral-900 transition-colors duration-[100ms] ease-out"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </footer>
  );
}
