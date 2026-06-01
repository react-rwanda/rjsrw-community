import { db } from "@/lib/db";
import { getCachedOrFetch } from "@/lib/cache";

export default async function MembersPage() {
  let active = 0;
  let verified = 0;

  try {
    const counts = await getCachedOrFetch(
      "member-counts",
      async () => {
        const [activeCount, verifiedCount] = await Promise.all([
          db.user.count(),
          db.user.count({ where: { emailVerified: true } }),
        ]);
        return { active: activeCount, verified: verifiedCount };
      },
      3600,
    );
    active = counts.active;
    verified = counts.verified;
  } catch {
    // DB not reachable counts defaulted to 0
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 w-full">
      <div className="flex flex-col gap-6 border-b border-neutral-200 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-[40px] font-extrabold tracking-tight text-neutral-900">
            Member Directory
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-500">
            Connecting the brightest React, React Native, and Web engineers across
            Rwanda. Discover collaborators, mentors, and local experts.
          </p>
        </div>

        <div className="flex flex-row items-center gap-3 pt-4 md:pt-0">
          <div className="inline-flex items-center justify-center border border-sky-200 bg-sky-50 px-3 py-1.5 text-[12px] font-bold uppercase tracking-widest text-sky-500">
            ACTIVE: {active.toLocaleString()}
          </div>
          <div className="inline-flex items-center justify-center border border-amber-200 bg-amber-50/50 px-3 py-1.5 text-[12px] font-bold uppercase tracking-widest text-amber-700">
            VERIFIED
          </div>
        </div>
      </div>
    </div>
  );
}
