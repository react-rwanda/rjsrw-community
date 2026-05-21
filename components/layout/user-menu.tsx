"use client";

import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getInitials } from "@/lib/utils";

export interface UserMenuSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    username?: string;
    role: "GUEST" | "MEMBER" | "ADMIN";
  };
}

interface UserMenuProps {
  session: UserMenuSession;
  variant?: "desktop" | "mobile";
}

export default function UserMenu({ session, variant = "desktop" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initials = getInitials(session.user.name);
  const profileHref = `/members/${session.user.username ?? session.user.id}`;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (variant === "mobile") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 px-4 py-3 border border-neutral-200">
          <span className="avatar size-10 inline-flex items-center justify-center bg-neutral-900 text-white text-[12px] font-semibold">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900 truncate">{session.user.name}</p>
            <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
          </div>
        </div>
        <div className="border border-neutral-200">
          <Link
            href={profileHref}
            className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-900 hover:bg-neutral-50 border-b border-neutral-200"
          >
            <UserIcon className="size-4" strokeWidth={1.5} />
            Profile
          </Link>
          {session.user.role === "ADMIN" && (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm text-neutral-900 hover:bg-neutral-50 border-b border-neutral-200"
            >
              <LayoutDashboard className="size-4" strokeWidth={1.5} />
              Dashboard
            </Link>
          )}
          <form action="/api/auth/sign-out" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-900 hover:bg-neutral-50"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user menu"
        className="inline-flex items-center gap-2 h-11 px-2 hover:bg-neutral-100 transition-colors"
      >
        <span className="avatar size-8 inline-flex items-center justify-center bg-neutral-900 text-white text-[11px] font-semibold">
          {initials}
        </span>
        <ChevronDown className="size-3.5 text-neutral-500" strokeWidth={1.5} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 w-56 bg-neutral-0 border border-neutral-200 shadow-xs"
        >
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="text-sm font-semibold text-neutral-900 truncate">{session.user.name}</p>
            <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
          </div>
          <Link
            href={profileHref}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-900 hover:bg-neutral-50"
            role="menuitem"
          >
            <UserIcon className="size-4" strokeWidth={1.5} />
            Profile
          </Link>
          {session.user.role === "ADMIN" && (
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-900 hover:bg-neutral-50"
              role="menuitem"
            >
              <LayoutDashboard className="size-4" strokeWidth={1.5} />
              Dashboard
            </Link>
          )}
          <form action="/api/auth/sign-out" method="post" className="border-t border-neutral-200">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-900 hover:bg-neutral-50"
              role="menuitem"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
