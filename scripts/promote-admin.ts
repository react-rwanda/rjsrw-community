// Promote a user to ADMIN by email.
//
// Usage:
//   pnpm tsx scripts/promote-admin.ts <email>
//
// Example:
//   pnpm tsx scripts/promote-admin.ts dev@example.rw
//
// After running, the affected user must sign out and back in for their session
// JWT to refresh with the new role. Only then will /dashboard be accessible.

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("✗ Email is required.\n  pnpm tsx scripts/promote-admin.ts <email>");
    process.exit(1);
  }

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    console.error(`✗ No user found with email ${email}`);
    process.exit(1);
  }

  if (user.role === "ADMIN") {
    console.log(`✓ ${user.name} <${user.email}> is already an ADMIN. No change.`);
    return;
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
    select: { name: true, email: true, role: true },
  });

  console.log(`✓ Promoted ${updated.name} <${updated.email}> → ${updated.role}`);
  console.log("  Sign out and back in for the new role to take effect.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
