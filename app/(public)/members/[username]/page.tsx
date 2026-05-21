import { notFound } from "next/navigation";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

import { db } from "@/lib/db";
import { getInitials } from "@/lib/utils";

const AVAILABILITY_LABEL: Record<string, { label: string; tone: string }> = {
  OPEN_TO_WORK: { label: "Open to Work", tone: "bg-success-100 text-success-600" },
  OPEN_TO_PROJECT: { label: "Open to Project", tone: "bg-success-100 text-success-600" },
  MENTORING: { label: "Available for Mentoring", tone: "bg-info-100 text-info-600" },
  NOT_LOOKING: { label: "Not Currently Looking", tone: "bg-neutral-100 text-neutral-500" },
};

export const dynamic = "force-dynamic";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const member = await db.user.findUnique({
    where: { username },
    select: {
      name: true,
      username: true,
      title: true,
      bio: true,
      image: true,
      role: true,
      stack: true,
      availability: true,
      githubUrl: true,
      twitterUrl: true,
      linkedinUrl: true,
      contributionPoints: true,
      createdAt: true,
    },
  });
  if (!member) notFound();

  const availability = AVAILABILITY_LABEL[member.availability] ?? AVAILABILITY_LABEL.NOT_LOOKING;
  const initials = getInitials(member.name);

  return (
    <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 py-12">
      <header className="flex flex-col sm:flex-row gap-6 sm:items-start pb-8 border-b border-neutral-200">
        <span className="avatar shrink-0 size-20 sm:size-24 inline-flex items-center justify-center bg-neutral-900 text-white text-xl font-bold grayscale">
          {initials}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              {member.name}
            </h1>
            {member.role === "ADMIN" && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] px-2 py-1 bg-primary-100 text-primary-700">
                Admin
              </span>
            )}
          </div>
          {member.title && (
            <p className="mt-1 text-base text-neutral-700">{member.title}</p>
          )}
          {member.username && (
            <p className="mt-2 font-mono text-sm text-primary-500">@{member.username}</p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <section className="lg:col-span-2 space-y-8">
          {member.bio && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-3">
                About
              </p>
              <p className="text-sm leading-relaxed text-neutral-700 max-w-prose">{member.bio}</p>
            </div>
          )}

          {member.stack.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-3">
                Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {member.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold uppercase tracking-[0.06em] px-2 py-1 border border-primary-500 text-primary-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border border-dashed border-neutral-300 bg-neutral-50 p-8">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
              Coming in Phase 2
            </p>
            <h2 className="mt-2 text-xl font-bold text-neutral-900">
              Full member profile
            </h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-prose leading-relaxed">
              Top contributions, forum activity, bookmarked articles, and registered events ship
              with <span className="font-mono text-neutral-700">ISSUE-037</span>. Pick it up from
              the backlog.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="border border-neutral-200 p-6 bg-neutral-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-3">
              Status
            </p>
            <div className="flex items-center gap-2">
              <span className={`status-dot ${availability.tone.split(" ")[0]}`} />
              <span className="text-sm font-medium text-neutral-900">{availability.label}</span>
            </div>
          </div>

          <div className="border border-neutral-200 p-6 bg-neutral-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500 mb-3">
              Contribution points
            </p>
            <p className="text-3xl font-extrabold tracking-tight text-neutral-900 tabular-nums">
              {member.contributionPoints.toLocaleString("en-US")}
            </p>
          </div>

          {(member.githubUrl || member.twitterUrl || member.linkedinUrl) && (
            <div className="border border-neutral-200 p-6 bg-neutral-0 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Elsewhere
              </p>
              {member.githubUrl && (
                <SocialLink href={member.githubUrl} icon={<Github className="size-4" strokeWidth={1.5} />}>
                  GitHub
                </SocialLink>
              )}
              {member.twitterUrl && (
                <SocialLink href={member.twitterUrl} icon={<Twitter className="size-4" strokeWidth={1.5} />}>
                  Twitter
                </SocialLink>
              )}
              {member.linkedinUrl && (
                <SocialLink href={member.linkedinUrl} icon={<Linkedin className="size-4" strokeWidth={1.5} />}>
                  LinkedIn
                </SocialLink>
              )}
            </div>
          )}

          <Link
            href="/members"
            className="block text-[13px] font-medium uppercase tracking-[0.08em] text-primary-500 hover:text-primary-600"
          >
            ← Back to directory
          </Link>
        </aside>
      </div>
    </main>
  );
}

function SocialLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-neutral-700 hover:text-primary-500 transition-colors"
    >
      {icon}
      {children}
    </a>
  );
}
