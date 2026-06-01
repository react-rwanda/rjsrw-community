"use client";

import Image from "next/image";
import Link from "next/link";
import { SquareTerminal } from "lucide-react";

type Availability =
  | "OPEN_TO_WORK"
  | "OPEN_TO_PROJECT"
  | "AVAILABLE_FOR_MENTORING"
  | "NOT_CURRENTLY_LOOKING";

interface MemberCardProps {
  name: string;
  title: string;
  handle: string;
  avatarUrl: string;
  stack: string[];
  contributions: string[];
  availability: Availability;
  profileUrl: string;
}

const AVAILABILITY_LABELS: Record<Availability, string> = {
  OPEN_TO_WORK: "OPEN TO WORK",
  OPEN_TO_PROJECT: "OPEN TO PROJECT",
  AVAILABLE_FOR_MENTORING: "AVAILABLE FOR MENTORING",
  NOT_CURRENTLY_LOOKING: "NOT CURRENTLY LOOKING",
};

const AVAILABILITY_DOT: Record<Availability, string> = {
  OPEN_TO_WORK: "bg-success-600",
  OPEN_TO_PROJECT: "bg-success-600",
  AVAILABLE_FOR_MENTORING: "bg-neutral-300",
  NOT_CURRENTLY_LOOKING: "bg-neutral-300",
};

const AVAILABILITY_TEXT: Record<Availability, string> = {
  OPEN_TO_WORK: "text-success-600",
  OPEN_TO_PROJECT: "text-success-600",
  AVAILABLE_FOR_MENTORING: "text-neutral-400",
  NOT_CURRENTLY_LOOKING: "text-neutral-400",
};

export function MemberCard({
  name,
  title,
  handle,
  avatarUrl,
  stack,
  contributions,
  availability,
  profileUrl,
}: MemberCardProps) {
  return (
    <Link
      href={profileUrl}
      className="group flex flex-col border border-neutral-200 bg-white p-6 hover:border-neutral-400 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-neutral-100">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover grayscale"
            />
          </div>
          <div className="pt-0">
            <p className="text-[24px] font-bold text-neutral-900 leading-none">
              {name}
            </p>
            <p className="text-[16px] text-neutral-500 mt-1.5">{title}</p>
            <p className="font-mono text-[12px] text-primary-500 mt-1 uppercase tracking-wider">
              @{handle}
            </p>
          </div>
        </div>
        <button
          aria-label="Open terminal profile"
          onClick={(e) => e.preventDefault()}
          className="shrink-0 flex items-center justify-center hover:opacity-80 transition-opacity"
        >
          <SquareTerminal className="w-[18px] h-[18px] text-neutral-600" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
          Stack
        </p>
        <div className="flex flex-wrap gap-2">
          {stack.map((tag) => {
            const isReact = tag.toLowerCase().includes("react");
            return (
              <span
                key={tag}
                className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  isReact
                    ? "bg-primary-50 text-primary-700"
                    : "bg-neutral-50 text-neutral-600"
                }`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mb-6 grow">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
          Top Contributions
        </p>
        <ul className="flex flex-col gap-1.5">
          {contributions.map((item) => (
            <li
              key={item}
              className="font-mono text-[13px] text-neutral-500 flex items-start gap-2"
            >
              <span 
                className="mt-[6px] shrink-0 w-1.5 h-1.5 bg-neutral-300"
                style={{ borderRadius: "9999px" }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-5 border-t border-neutral-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 shrink-0 ${AVAILABILITY_DOT[availability]}`}
            style={{ borderRadius: "9999px" }}
          />
          <span className={`text-[11px] font-bold uppercase tracking-widest ${AVAILABILITY_TEXT[availability]}`}>
            {AVAILABILITY_LABELS[availability]}
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-900 hover:text-primary-600 transition-colors whitespace-nowrap">
          View Full Profile
        </span>
      </div>
    </Link>
  );
}
