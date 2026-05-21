import PageHeader from "@/components/layout/page-header";

export default function DashboardPublicationsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Publications"
        description="Review pending article submissions. Approve, reject, and manage published guides."
      />
      <div className="border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Coming soon
        </p>
        <h2 className="mt-3 text-2xl font-bold text-neutral-900">
          This page is ready for a contributor
        </h2>
        <p className="mt-2 mx-auto max-w-md text-sm text-neutral-500 leading-relaxed">
          The publication review queue with Approve / Reject inline actions ships in Phase 5{" "}
          <span className="font-mono text-neutral-700">ISSUE-074</span>. Pick it up from the GitHub
          backlog.
        </p>
      </div>
    </div>
  );
}
