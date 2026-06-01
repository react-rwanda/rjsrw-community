"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, ReactNode } from "react";

type FilterValue = "WORKSHOP" | "COMMUNITY" | "NETWORKING";

interface FilterTag {
  label: string;
  value: FilterValue;
  activeBg: string;
  activeText: string;
  activeBorder: string;
  hoverBorder: string;
}

const FILTER_TAGS: FilterTag[] = [
  {
    label: "Live Workshop",
    value: "WORKSHOP",
    activeBg: "bg-success-100",
    activeText: "text-success-600",
    activeBorder: "border-success-600",
    hoverBorder: "hover:border-success-600",
  },
  {
    label: "Community Night",
    value: "COMMUNITY",
    activeBg: "bg-warning-100",
    activeText: "text-warning-700",
    activeBorder: "border-warning-700",
    hoverBorder: "hover:border-warning-700",
  },
  {
    label: "Networking",
    value: "NETWORKING",
    activeBg: "bg-info-100",
    activeText: "text-info-600",
    activeBorder: "border-info-600",
    hoverBorder: "hover:border-info-600",
  },
];

const HeaderShell = ({ children }: { children?: ReactNode }) => (
  <div className="max-w-3xl">
    <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-[-0.02em] text-neutral-900">
      Events Hub
    </h1>
    <p className="mt-6 text-base leading-relaxed text-neutral-700">
      Connecting Rwanda&apos;s top React talent through technical meetups, deep-dive <br className="hidden md:block" />
      workshops, and community showcases. Built for developers, by developers.
    </p>
    {children}
  </div>
);

function EventHeaderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type");

  const handleTagClick = (value: FilterValue) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentType === value) {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <HeaderShell>
      <div className="flex flex-wrap gap-3 mt-6">
        {FILTER_TAGS.map((tag) => {
          const isSelected = currentType === tag.value;

          return (
            <button
              key={tag.value}
              onClick={() => handleTagClick(tag.value)}
              className={`
                border px-3 py-1 text-[13px] font-semibold transition-colors duration-150
                ${
                  isSelected
                    ? `${tag.activeBg} ${tag.activeText} ${tag.activeBorder}`
                    : `border-neutral-200 text-neutral-700 bg-transparent ${tag.hoverBorder}`
                }
              `}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
    </HeaderShell>
  );
}

export function EventFilterTags() {
  return (
    <Suspense fallback={
      <HeaderShell>
        <div className="flex gap-3 mt-6 h-[30px]"></div>
      </HeaderShell>
    }>
      <EventHeaderContent />
    </Suspense>
  );
}
