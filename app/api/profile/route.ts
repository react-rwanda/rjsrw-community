import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth-guard";
import { NextResponse } from "next/server";
import { z } from "zod";

const ProfileSchema = z.object({
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(24, "At most 24 characters")
    .regex(/^[A-Z0-9_]+$/, "Uppercase letters, digits, and underscores only"),
  title: z.string().min(2).max(80),
  stack: z.array(z.string()).min(1, "Pick at least one"),
  availability: z.enum(["OPEN_TO_WORK", "OPEN_TO_PROJECT", "MENTORING", "NOT_LOOKING"]),
});

export async function PATCH(req: Request) {
  const { session, error } = await requireSession();
  if (error) return error;

  const body = await req.json();
  const parsed = ProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { username } = parsed.data;
  const existing = await db.user.findFirst({
    where: { username, NOT: { id: session.user.id } },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json(
      { error: "That username is already taken." },
      { status: 409 },
    );
  }

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: parsed.data,
    select: {
      id: true,
      username: true,
      title: true,
      stack: true,
      availability: true,
    },
  });

  return NextResponse.json(updated);
}
