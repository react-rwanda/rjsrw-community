"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu, { type UserMenuSession } from "@/components/layout/user-menu";

const NAV_LINKS = [
  { href: "/", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/members", label: "Members" },
  { href: "/library", label: "Library" },
  { href: "/forum", label: "Forum" },
] as const;

interface NavbarProps {
  session: UserMenuSession | null;
}

export default function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Lock body scroll while the mobile overlay is open
  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [mobileOpen]);

  // Close the mobile overlay if the route changes (browser back, link click)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 bg-neutral-0 border-b border-neutral-200">
        <div className="h-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-[auto_1fr_auto] items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-neutral-900 hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            React JS Rwanda
          </Link>

          {/* Center nav — desktop only */}
          <nav className="hidden lg:flex items-center justify-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative h-16 flex items-center text-[13px] font-medium uppercase tracking-[0.08em] transition-colors",
                    active ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-900",
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute bottom-3 left-0 right-0 h-[2px] bg-primary-500"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: search + auth (desktop) */}
          <div className="hidden lg:flex items-center gap-4 justify-end">
            <form
              role="search"
              action="/search"
              className={cn(
                "relative flex items-center transition-[width] duration-150 ease-out",
                searchFocused ? "w-[280px]" : "w-[200px]",
              )}
            >
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="q"
                placeholder="Search docs..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full h-[38px] pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-0 border border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                aria-label="Search the site"
              />
            </form>

            {session ? (
              <UserMenu session={session} />
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center h-11 px-6 bg-neutral-900 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-700 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="lg:hidden col-start-3 inline-flex items-center justify-center size-10 text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <Menu className="size-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="lg:hidden fixed inset-0 z-50 bg-neutral-0 flex flex-col"
        >
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-neutral-200 shrink-0">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-[16px] font-extrabold uppercase tracking-[0.06em] text-neutral-900"
            >
              React JS Rwanda
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex items-center justify-center size-10 text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto flex flex-col px-6 py-8 gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative py-4 text-2xl font-extrabold uppercase tracking-[0.04em] transition-colors",
                    active ? "text-neutral-900" : "text-neutral-700 hover:text-neutral-900",
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 w-[3px] h-8 bg-primary-500"
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 px-6 pb-8 space-y-4 border-t border-neutral-200 pt-6">
            <form
              role="search"
              action="/search"
              className="relative flex items-center"
              onSubmit={() => setMobileOpen(false)}
            >
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="q"
                placeholder="Search docs..."
                className="w-full h-12 pl-10 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 bg-neutral-0 border border-neutral-200 focus:border-primary-500 focus:outline-none transition-colors"
                aria-label="Search the site"
              />
            </form>

            {session ? (
              <UserMenu session={session} variant="mobile" />
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center h-12 px-6 bg-neutral-900 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-700 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
