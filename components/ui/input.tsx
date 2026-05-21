import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // design-style-guide.md §7.2: h-11 (44px), white bg, 1px #E5E5E5 border,
          // sharp corners, cyan focus border (no outline ring).
          "flex h-11 w-full bg-neutral-0 border border-neutral-200 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400",
          "focus:border-primary-500 focus:outline-none transition-colors",
          "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed",
          "aria-invalid:border-error-600 aria-invalid:focus:border-error-600",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-900",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
