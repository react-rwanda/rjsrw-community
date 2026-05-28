import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getCurrentSession } from "@/lib/auth";
import type { UserMenuSession } from "@/components/layout/user-menu";

// Public route group: anything inside (public) gets the public navbar
// (and, in Phase 2 / ISSUE-011, the public footer). Dashboard and (auth)
// routes have their own layouts and do NOT inherit this chrome.

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  const navSession: UserMenuSession | null = session
    ? {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? null,
          username: (session.user as { username?: string | null }).username ?? undefined,
          role: ((session.user as { role?: string }).role ?? "MEMBER") as
            | "GUEST"
            | "MEMBER"
            | "ADMIN",
        },
      }
    : null;

  return (
    <>
      <Navbar session={navSession} />
      {children}
      <Footer />
    </>
  );
}
