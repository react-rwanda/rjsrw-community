// Hero section — two-column split layout for the landing page.
// Left: bordered pill badge, ultra-heavy headline with cyan "React" highlight, subtext, dual CTAs, stats.
// Right: bordered photograph with component spotlight overlay card.

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* ─── Left column ─── */}
        <div className="flex flex-col gap-8">
          {/* Pill badge — bordered pill with cyan dot */}
          <div className="inline-flex items-center gap-2 w-fit border border-neutral-200 px-4 py-2">
            <span className="status-dot bg-primary-500" />
            <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-900">
              Live from Kigali, Rwanda
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[32px] sm:text-[44px] lg:text-[56px] font-black leading-[1.0] tracking-[-0.03em] text-neutral-900">
            Scaling the future{" "}
            <br className="hidden sm:block" />
            of Rwanda with{" "}
            <span className="bg-neutral-950 text-primary-500 px-2 whitespace-nowrap inline-block">
              React
            </span>
            .
          </h1>

          {/* Supporting copy — matches Figma text exactly */}
          <p className="text-[16px] font-normal leading-[1.6] text-neutral-500 max-w-md">
            Join the premier community of Rwandan engineers, architects, and designers
            building the next generation of high-performance web applications in the
            heart of East Africa.
          </p>

          {/* Dual CTAs — using Button component */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="primary" size="default" asChild>
              <Link href="/register">Join the Community</Link>
            </Button>
            <Button variant="secondary" size="default" asChild>
              <Link href="/library">View Local Projects</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex gap-10 pt-4">
            <div>
              <p className="text-[28px] font-extrabold text-neutral-900">1.2k+</p>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Devs in Kigali
              </p>
            </div>
            <div>
              <p className="text-[28px] font-extrabold text-neutral-900">45</p>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Monthly Meetups
              </p>
            </div>
            <div>
              <p className="text-[28px] font-extrabold text-neutral-900">12</p>
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-500">
                Open Source Projects
              </p>
            </div>
          </div>
        </div>

        {/* ─── Right column ─── */}
        <div className="relative">
          {/* Bordered photograph frame with cyan accent top-right */}
          <div className="relative border border-neutral-200 overflow-hidden">
            {/* Cyan accent block — top right corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500 z-10" />
            <img
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format&fit=crop"
              alt="Developers collaborating at a meetup in Kigali"
              className="w-full h-auto object-cover grayscale"
            />
          </div>

          {/* Component spotlight overlay card */}
          <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-[280px] border border-neutral-200 bg-white p-4">
            <p className="text-[13px] font-mono text-neutral-400 mb-1">
              // Latest Component Spotlight
            </p>
            <p className="text-[16px] font-bold text-neutral-900 leading-tight">
              Rwanda Digital Services UI Kit v2.0
            </p>
            {/* Cyan accent bar at bottom of card */}
            <div className="mt-3 h-2 w-12 bg-primary-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
