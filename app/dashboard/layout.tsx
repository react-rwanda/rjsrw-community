import { redirect } from "next/navigation";
import { Suspense } from "react";

import AdminSidebar from "@/components/layout/admin-sidebar";
import { getCurrentSession } from "@/lib/auth";

// Server-side defense in depth. The edge proxy (proxy.ts) only checks for a
// valid session cookie; the actual ADMIN role check happens here, since it
// requires a DB read. Non-admin members are bounced back to home.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect("/login?redirect=/dashboard");

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-neutral-0">
      <AdminSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          image: session.user.image ?? null,
        }}
      />
      <main className="lg:ml-[260px] min-h-screen">
        <div className="px-6 lg:px-10 py-8 max-w-[1280px]">
          <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3 pb-6 border-b border-neutral-200">
        <div className="h-3 w-32 bg-neutral-100 animate-pulse" />
        <div className="h-9 w-64 bg-neutral-100 animate-pulse" />
        <div className="h-4 w-80 bg-neutral-100 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-neutral-200 p-6 space-y-3">
            <div className="h-3 w-20 bg-neutral-100 animate-pulse" />
            <div className="h-8 w-12 bg-neutral-100 animate-pulse" />
            <div className="h-3 w-24 bg-neutral-100 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
