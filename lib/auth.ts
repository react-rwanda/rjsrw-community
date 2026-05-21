import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { headers } from "next/headers";

import { db } from "@/lib/db";

const hasGithubCreds = !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET;
const hasGoogleCreds = !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    ...(hasGithubCreds && {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      },
    }),
    ...(hasGoogleCreds && {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    }),
  },

  // Exposes our domain fields through the Better Auth API so they survive
  // sign-up and round-trip through getSession(). Prisma already has the
  // columns + defaults — this just tells Better Auth they exist.
  user: {
    additionalFields: {
      username: { type: "string", required: false, input: false },
      role: { type: "string", required: false, defaultValue: "MEMBER", input: false },
      title: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
      availability: { type: "string", required: false, defaultValue: "NOT_LOOKING", input: false },
      githubUrl: { type: "string", required: false, input: false },
      twitterUrl: { type: "string", required: false, input: false },
      linkedinUrl: { type: "string", required: false, input: false },
      contributionPoints: { type: "number", required: false, defaultValue: 0, input: false },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
  },
});

export type Session = typeof auth.$Infer.Session;

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}
