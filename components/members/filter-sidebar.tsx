"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STACKS = [
  { id: "ReactJS", label: "React JS" },
  { id: "ReactNative", label: "React Native" },
  { id: "Nextjs", label: "Next.js" },
  { id: "TypeScript", label: "TypeScript" },
];

const AVAILABILITIES = [
  { id: "OPEN_TO_WORK", label: "Open to Work" },
  { id: "OPEN_TO_PROJECT", label: "Open to Project" },
  { id: "AVAILABLE_FOR_MENTORING", label: "Available for Mentoring" },
  { id: "NOT_CURRENTLY_LOOKING", label: "Not Currently Looking" },
];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStacks = searchParams.get("stack")?.split(",") || [];
  const currentAvailability = searchParams.get("availability") || "";

  const handleStackChange = useCallback(
    (id: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      let newStacks = [...currentStacks].filter(Boolean);
      
      if (checked) {
        if (!newStacks.includes(id)) newStacks.push(id);
      } else {
        newStacks = newStacks.filter((s) => s !== id);
      }

      if (newStacks.length > 0) {
        params.set("stack", newStacks.join(","));
      } else {
        params.delete("stack");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [currentStacks, router, searchParams]
  );

  const handleAvailabilityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set("availability", val);
      } else {
        params.delete("availability");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAll = () => {
    router.push("?", { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-xs">
      <div>
        <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-neutral-500">
          Filter by Stack
        </h3>
        <div className="flex flex-col gap-4">
          {STACKS.map((stack) => (
            <div key={stack.id} className="flex items-center space-x-3">
              <Checkbox
                id={`stack-${stack.id}`}
                checked={currentStacks.includes(stack.id)}
                onCheckedChange={(checked) =>
                  handleStackChange(stack.id, checked as boolean)
                }
              />
              <Label
                htmlFor={`stack-${stack.id}`}
                className="text-sm font-medium leading-none text-neutral-900 cursor-pointer"
              >
                {stack.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em] text-neutral-500">
          Availability
        </h3>
        <select
          className="w-full h-11 border border-neutral-300 bg-white px-3 text-[15px] text-neutral-900 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
          value={currentAvailability}
          onChange={handleAvailabilityChange}
        >
          <option value="">Any Availability</option>
          {AVAILABILITIES.map((avail) => (
            <option key={avail.id} value={avail.id}>
              {avail.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full border-neutral-900"
          onClick={clearAll}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );
}
