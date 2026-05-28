import Link from "next/link";

import { Button } from "@/components/ui/button";

const CODE_DECORATION = `export default function Community() {
  return (
    <Layout>
      <KigaliHub>
        <Developers
          count={1200}
          vibe="High Energy"
        />
      </KigaliHub>
    </Layout>
  )
}`;

export default function CtaSection() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:px-12">
      <div className="relative grid w-full gap-10 overflow-hidden bg-neutral-950 px-6 py-10 sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-extrabold leading-tight tracking-[-0.02em] text-white lg:text-[40px]">
            Ready to build the Rwandan Digital Renaissance?
          </h2>

          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-neutral-400">
            Access our library of local components, participate in weekly tech talks, and help us put
            Kigali on the global React map.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild variant="accent" className="w-full px-8 sm:w-auto">
              <Link href="https://discord.gg/" target="_blank" rel="noreferrer">
                JOIN DISCORD
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-full border-neutral-700 bg-transparent px-8 text-white hover:bg-neutral-900 hover:text-white sm:w-auto"
            >
              <Link href="/#sponsor-community">SPONSOR COMMUNITY</Link>
            </Button>
          </div>
        </div>

        <div className="pointer-events-none relative hidden lg:block">
          <pre className="select-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-primary-500 opacity-5">
            {CODE_DECORATION}
          </pre>
        </div>
      </div>
    </section>
  );
}
