import { BookOpen, Calendar, MessageSquare, Users } from "lucide-react";

import PageHeader from "@/components/layout/page-header";
import { getAdminStats } from "@/lib/admin-stats";
import { formatCompact } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="border border-neutral-200 bg-neutral-0 p-6 hover:border-neutral-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
          {label}
        </p>
        <span className="size-10 inline-flex items-center justify-center bg-primary-50 text-primary-600 shrink-0">
          {icon}
        </span>
      </div>
      <p className="mt-6 text-[32px] font-extrabold tracking-tight text-neutral-900 tabular-nums">
        {formatCompact(value)}
      </p>
    </div>
  );
}

export default async function DashboardOverviewPage() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="React JS Rwanda — Admin overview." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total members"
          value={stats.totalMembers}
          icon={<Users className="size-5" strokeWidth={1.5} />}
        />
        <StatCard
          label="Upcoming events"
          value={stats.upcomingEvents}
          icon={<Calendar className="size-5" strokeWidth={1.5} />}
        />
        <StatCard
          label="Pending publications"
          value={stats.pendingPublications}
          icon={<BookOpen className="size-5" strokeWidth={1.5} />}
        />
        <StatCard
          label="Forum threads"
          value={stats.forumThreads}
          icon={<MessageSquare className="size-5" strokeWidth={1.5} />}
        />
      </div>

      <section className="border border-dashed border-neutral-300 bg-neutral-50 p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Coming soon
        </p>
        <h2 className="mt-2 text-xl font-bold text-neutral-900">Quick actions</h2>
        <p className="mt-2 text-sm text-neutral-500 max-w-prose leading-relaxed">
          Pending publications review queue, new event creation, and member role management land in
          Phase 5 (ISSUE-070..078). Pick one up from the backlog.
        </p>
      </section>
    </div>
  );
}
