"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Users,
  X,
} from "lucide-react";

import { cn, getInitials } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/events", label: "Events", icon: Calendar },
  { href: "/dashboard/members", label: "Members", icon: Users },
  { href: "/dashboard/publications", label: "Publications", icon: BookOpen },
  { href: "/dashboard/forum", label: "Forum", icon: MessageSquare },
] as const;

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (!mobileOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    router.push("/login");
    router.refresh();
  }

  const initials = getInitials(user.name);

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="px-6 py-5 border-b border-neutral-200">
        <Link
          href="/"
          className="block text-[14px] font-extrabold uppercase tracking-[0.06em] text-neutral-900 hover:opacity-80 transition-opacity"
        >
          React JS Rwanda
        </Link>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 h-10 px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-neutral-50 text-neutral-900"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50",
                  )}
                >
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-500"
                    />
                  )}
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User block */}
      <div className="border-t border-neutral-200 p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="avatar size-8 inline-flex items-center justify-center bg-neutral-900 text-white text-[11px] font-semibold shrink-0">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900 truncate">{user.name}</p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full inline-flex items-center gap-2 h-9 px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — fixed left, 260px */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[260px] bg-neutral-0 border-r border-neutral-200 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile top bar with hamburger */}
      <div className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-neutral-200 bg-neutral-0 sticky top-0 z-30">
        <Link
          href="/"
          className="text-[14px] font-extrabold uppercase tracking-[0.06em] text-neutral-900"
        >
          React JS Rwanda
          <span className="ml-2 text-[11px] font-semibold tracking-[0.08em] text-primary-500">
            ADMIN
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          className="inline-flex items-center justify-center size-10 text-neutral-900 hover:bg-neutral-100 transition-colors"
        >
          <Menu className="size-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-neutral-900/60"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside
            className="lg:hidden fixed inset-y-0 left-0 w-[280px] bg-neutral-0 z-50 flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
          >
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 inline-flex items-center justify-center size-8 text-neutral-700 hover:bg-neutral-100 transition-colors z-10"
            >
              <X className="size-5" strokeWidth={1.5} />
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
