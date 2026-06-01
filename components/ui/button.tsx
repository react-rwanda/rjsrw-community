import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Variants mirror design-style-guide.md §7.1.
// Sharp rectangles, no shadows, ALL CAPS text on primary/secondary/accent.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary — solid black, the default CTA
        primary:
          "bg-neutral-900 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-700 active:scale-[0.99]",
        // Secondary — outlined black on white
        secondary:
          "bg-transparent border border-neutral-900 text-neutral-900 text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-50",
        // Accent — cyan filled (Discord / Subscribe)
        accent:
          "bg-primary-500 text-neutral-900 text-[13px] font-bold uppercase tracking-[0.06em] hover:bg-primary-600",
        // Outline — light outlined button used inside content cards (e.g. SLIDES, VIDEO)
        outline:
          "bg-transparent border border-neutral-200 text-neutral-900 text-[13px] font-semibold uppercase tracking-[0.06em] hover:bg-neutral-50 hover:border-neutral-300",
        // Ghost — text link in cyan
        ghost:
          "text-primary-500 text-[13px] font-medium hover:text-primary-600 hover:underline underline-offset-4",
        // Destructive — used in admin confirms
        destructive:
          "bg-error-600 text-white text-[13px] font-semibold uppercase tracking-[0.06em] hover:opacity-90",
      },
      size: {
        default: "h-11 px-6 [&_svg]:size-4",
        sm: "h-10 px-5 [&_svg]:size-4",
        lg: "h-12 px-8 [&_svg]:size-4",
        icon: "h-10 w-10 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
