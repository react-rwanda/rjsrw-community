import { NextResponse } from "next/server";

import { requireRole } from "@/lib/auth-guard";
import { getAdminStats } from "@/lib/admin-stats";

export async function GET() {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const stats = await getAdminStats();
  return NextResponse.json(stats);
}
