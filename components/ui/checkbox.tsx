"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Sharp 18px box, cyan when checked. design-style-guide.md §3.
      "grid place-content-center peer h-4.5 w-4.5 shrink-0 border border-neutral-300 bg-neutral-0 transition-colors",
      "focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary-500 data-[state=checked]:border-primary-500 data-[state=checked]:text-neutral-0",
      "hover:border-neutral-500 data-[state=checked]:hover:bg-primary-600",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="grid place-content-center">
      <Check className="size-3" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
