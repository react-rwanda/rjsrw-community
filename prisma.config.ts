import dotenv from "dotenv";
// Load .env.local first (developer overrides), then fall back to .env.
// Prisma's CLI does not auto-load .env.local the way Next.js does.
dotenv.config({ path: ".env.local" });
dotenv.config();

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
