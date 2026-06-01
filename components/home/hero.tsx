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
            <span className="text-label text-neutral-900">
              Live from Kigali, Rwanda
            </span>
          </div>

          {/* Headline — responsive: text-h1 on mobile, display-sm on tablet, display on desktop */}
          <h1 className="text-h1 sm:text-display-sm lg:text-display text-neutral-900">
            Scaling the future{" "}
            <br className="hidden sm:block" />
            of Rwanda with{" "}
            <span className="bg-neutral-950 text-primary-100 px-2 whitespace-nowrap inline-block">
              React
            </span>
            .
          </h1>

          {/* Supporting copy */}
          <p className="text-body-lg text-neutral-500 max-w-md">
            Join the premier community of Rwandan engineers, architects, and designers
            building the next generation of high-performance web applications in the
            heart of East Africa.
          </p>

          {/* Dual CTAs — stacked vertically per Figma */}
          <div className="flex flex-col gap-3 w-fit">
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
              <p className="text-stat text-neutral-900">1.2k+</p>
              <p className="text-label text-neutral-500">Devs in Kigali</p>
            </div>
            <div>
              <p className="text-stat text-neutral-900">45</p>
              <p className="text-label text-neutral-500">Monthly Meetups</p>
            </div>
            <div>
              <p className="text-stat text-neutral-900">12</p>
              <p className="text-label text-neutral-500">Open Source Projects</p>
            </div>
          </div>
        </div>

        {/* ─── Right column ─── */}
        <div className="relative">
          {/* Cyan accent block — top right corner, behind the frame */}
          <div className="absolute -top-5 -right-5 w-28 h-28 bg-primary-100 z-0" />

          {/* Cyan accent block — bottom left corner, behind the frame */}
          <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-primary-100 z-0" />

          {/* Photo frame — thick white padding with thin gray border */}
          <div className="relative z-10 border border-neutral-200 bg-white p-3 sm:p-4">
            {/* Image */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80&auto=format&fit=crop"
                alt="Developers collaborating at a meetup in Kigali"
                className="w-full h-auto object-cover grayscale"
              />

              {/* Component spotlight card — inside image, bottom-left */}
              <div className="absolute bottom-4 left-4 w-[240px] sm:w-[280px] bg-white p-4">
                <p className="text-mono text-neutral-400 mb-2">
                  // Latest Component Spotlight
                </p>
                <p className="text-h4 text-neutral-900 leading-tight">
                  Rwanda Digital Services UI Kit v2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
