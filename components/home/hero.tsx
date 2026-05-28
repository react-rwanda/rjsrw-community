// Hero section — two-column split layout for the landing page.
// Left: pill badge, ultra-heavy headline with cyan "React" highlight, subtext, dual CTAs.
// Right: bordered photograph with component spotlight overlay card.

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ─── Left column ─── */}
        <div className="flex flex-col gap-8">
          {/* Pill badge */}
          <div className="flex items-center gap-2 w-fit">
            <span className="status-dot bg-primary-500" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-900">
              Live from Kigali, Rwanda
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[32px] sm:text-[44px] lg:text-[56px] font-black leading-[1.0] tracking-[-0.03em] text-neutral-900"
          >
            Scaling the future{" "}
            <br className="hidden sm:block" />
            of Rwanda with{" "}
            <span className="bg-neutral-950 text-primary-500 px-2 whitespace-nowrap inline-block">
              React
            </span>
            .
          </h1>

          {/* Supporting copy */}
          <p className="text-[16px] font-normal leading-[1.6] text-neutral-500 max-w-md">
            The professional community for React and React Native developers in Rwanda.
            Events, publications, mentorship, and open-source — built by the community,
            for the community.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center h-[44px] px-6 bg-neutral-900 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-700 transition-colors duration-[120ms] ease-out focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
            >
              Join the Community
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center h-[44px] px-6 border border-neutral-900 text-neutral-900 text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-50 transition-colors duration-[120ms] ease-out focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
            >
              View Local Projects
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-[28px] font-extrabold text-neutral-900">250+</p>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Active Devs
              </p>
            </div>
            <div>
              <p className="text-[28px] font-extrabold text-neutral-900">12</p>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Monthly Meetups
              </p>
            </div>
            <div>
              <p className="text-[28px] font-extrabold text-neutral-900">30+</p>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Open Source Projects
              </p>
            </div>
          </div>
        </div>

        {/* ─── Right column ─── */}
        <div className="relative">
          {/* Bordered photograph frame */}
          <div className="border border-neutral-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format&fit=crop"
              alt="Developers collaborating at a meetup in Kigali"
              className="w-full h-auto object-cover grayscale"
            />
          </div>

          {/* Component spotlight overlay card */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-[280px] border border-neutral-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary-500 mb-2">
              Component Spotlight
            </p>
            <p className="text-[14px] font-bold text-neutral-900 leading-tight">
              useKigaliTime()
            </p>
            <p className="text-[13px] text-neutral-500 mt-1 leading-snug">
              A lightweight hook for CAT timezone formatting — built by the community.
            </p>
            <div className="mt-3 bg-neutral-950 p-3">
              <code className="text-[12px] font-mono text-primary-500 leading-relaxed">
                {"const { formatted } = useKigaliTime()"}
              </code>
            </div>
            <Link
              href="/library"
              className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary-500 uppercase tracking-[0.06em] hover:text-primary-700 transition-colors duration-[100ms]"
            >
              Explore Library
              <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
