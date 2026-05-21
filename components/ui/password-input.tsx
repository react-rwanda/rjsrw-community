"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [shown, setShown] = React.useState(false);
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={shown ? "text" : "password"}
          className={cn("pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShown((s) => !s)}
          aria-label={shown ? "Hide password" : "Show password"}
          aria-pressed={shown}
          tabIndex={-1}
          className="absolute right-0 top-0 inline-flex items-center justify-center w-11 h-11 text-neutral-400 hover:text-neutral-700 transition-colors focus-visible:outline-2 focus-visible:outline-primary-500 focus-visible:outline-offset-[-2px]"
        >
          {shown ? (
            <EyeOff className="size-4" strokeWidth={1.5} />
          ) : (
            <Eye className="size-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
