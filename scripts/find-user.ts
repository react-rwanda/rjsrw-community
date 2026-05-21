import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, email: true, username: true, role: true, createdAt: true },
    });
    console.log("Most recent 5 users:");
    console.table(users);
    return;
  }
  const user = await db.user.findFirst({
    where: { OR: [{ username: arg }, { email: arg }] },
    select: { id: true, name: true, email: true, username: true, role: true },
  });
  console.log(user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
