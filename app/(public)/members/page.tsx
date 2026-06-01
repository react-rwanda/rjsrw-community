import { db } from "@/lib/db";
import { getCachedOrFetch } from "@/lib/cache";

export default async function MembersPage() {
  const { active, verified } = await getCachedOrFetch(
    "member-counts",
    async () => {
      const [active, verified] = await Promise.all([
        db.user.count(),
        db.user.count({ where: { emailVerified: true } }),
      ]);
      return { active, verified };
    },
    3600,
  );

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Directory</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Browse and connect with other members of the ReactJS Rwanda community.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="inline-flex items-center justify-between rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:justify-center">
            <span className="text-neutral-500 dark:text-neutral-400 mr-2">ACTIVE</span>
            <span className="font-bold">{active}</span>
          </div>
          <div className="inline-flex items-center justify-between rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-sm font-medium shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:justify-center">
            <span className="text-neutral-500 dark:text-neutral-400 mr-2">VERIFIED</span>
            <span className="font-bold">{verified}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
