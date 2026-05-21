import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type Role = "GUEST" | "MEMBER" | "ADMIN";

export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    } as const;
  }
  return { session, error: null } as const;
}

export async function requireRole(role: Role | Role[]) {
  const { session, error } = await requireSession();
  if (error) return { session: null, error } as const;

  const allowed = Array.isArray(role) ? role : [role];
  const userRole = (session.user as { role?: Role }).role;
  if (!userRole || !allowed.includes(userRole)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    } as const;
  }
  return { session, error: null } as const;
}
