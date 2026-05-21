import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require any authenticated user (MEMBER or ADMIN).
const memberPrefixes = ["/profile/settings", "/forum/new", "/library/submit"];

// Routes that require ADMIN role specifically.
const adminPrefixes = ["/dashboard"];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = matchesPrefix(pathname, memberPrefixes) || matchesPrefix(pathname, adminPrefixes);
  if (!needsAuth) return NextResponse.next();

  // Edge-safe session check — Better Auth signs the session cookie with the
  // server secret, so presence + signature validation is enough at the edge.
  // Role check still happens server-side via requireRole() inside each route.
  const sessionCookie = getSessionCookie(req);
  if (!sessionCookie) {
    const signInUrl = new URL("/login", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/forum/new",
    "/library/submit",
  ],
};
