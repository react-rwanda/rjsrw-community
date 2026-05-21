export default function Loading() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-6xl mx-auto">
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-3 w-24 bg-neutral-100 animate-pulse" />
          <div className="h-10 w-3/4 bg-neutral-100 animate-pulse" />
          <div className="h-4 w-1/2 bg-neutral-100 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-neutral-200 p-6 space-y-3">
              <div className="h-3 w-16 bg-neutral-100 animate-pulse" />
              <div className="h-6 w-3/4 bg-neutral-100 animate-pulse" />
              <div className="h-4 w-full bg-neutral-100 animate-pulse" />
              <div className="h-4 w-2/3 bg-neutral-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
