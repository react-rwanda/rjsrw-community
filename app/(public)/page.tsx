// Placeholder landing page — the full landing is built in Phase 2 (ISSUE-022..026).
// This screen exists so the foundation scaffold compiles and is browseable.

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Foundation · v0.1
        </p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
          REACT JS RWANDA
        </h1>
        <p className="mt-4 text-sm text-neutral-500 leading-relaxed">
          The scaffold is up. Public pages, member directory, library, and forum land in Phase 2 —
          see <code className="font-mono text-neutral-700">project-phases.md</code>. Pick an issue
          from the backlog and start contributing — read{" "}
          <code className="font-mono text-neutral-700">CONTRIBUTING.md</code> first.
        </p>
      </div>
    </main>
  );
}
