"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

const STACK_OPTIONS = [
  "React JS",
  "React Native",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "Other",
];

const AVAILABILITY_OPTIONS = [
  { value: "OPEN_TO_WORK", label: "Open to Work" },
  { value: "OPEN_TO_PROJECT", label: "Open to Project" },
  { value: "MENTORING", label: "Available for Mentoring" },
  { value: "NOT_LOOKING", label: "Not Currently Looking" },
] as const;

const ProfileSchema = z.object({
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(24, "At most 24 characters")
    .regex(/^[A-Z0-9_]+$/, "Uppercase letters, digits, and underscores only"),
  title: z
    .string()
    .min(2, "Tell us your role")
    .max(80, "Keep it under 80 characters"),
  stack: z.array(z.string()).min(1, "Pick at least one"),
  availability: z.enum(["OPEN_TO_WORK", "OPEN_TO_PROJECT", "MENTORING", "NOT_LOOKING"]),
});

type ProfileInput = z.infer<typeof ProfileSchema>;

export default function ProfileSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: "",
      title: "",
      stack: [],
      availability: "OPEN_TO_WORK",
    },
  });

  const usernamePreview = form.watch("username");

  async function onSubmit(values: ProfileInput) {
    setLoading(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    setLoading(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      toast.error(data.error ?? "Could not save your profile");
      return;
    }
    toast.success("Profile saved");
    router.push("/members/" + values.username);
    router.refresh();
  }

  return (
    <div className="bg-neutral-0 border border-neutral-200 p-8 sm:p-10">
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Step 2 of 2
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
          Set up your profile
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          This is how the community will find you in the directory.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="JANE_M"
                    className="font-mono"
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))
                    }
                  />
                </FormControl>
                <FormDescription>
                  {usernamePreview ? (
                    <span className="font-mono text-primary-500">@{usernamePreview}</span>
                  ) : (
                    <>How you&apos;ll appear: <span className="font-mono">@YOURNAME</span></>
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                  Title / role
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Senior React Developer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stack"
            render={() => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                  Stack
                </FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {STACK_OPTIONS.map((option) => (
                    <FormField
                      key={option}
                      control={form.control}
                      name="stack"
                      render={({ field }) => {
                        const checked = field.value.includes(option);
                        return (
                          <label
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 border cursor-pointer transition-colors",
                              checked
                                ? "border-primary-500 bg-primary-50"
                                : "border-neutral-200 hover:border-neutral-300",
                            )}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) => {
                                if (value) field.onChange([...field.value, option]);
                                else field.onChange(field.value.filter((s) => s !== option));
                              }}
                            />
                            <span className="text-sm text-neutral-900">{option}</span>
                          </label>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                  Availability
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-2"
                  >
                    {AVAILABILITY_OPTIONS.map((option) => {
                      const checked = field.value === option.value;
                      return (
                        <label
                          key={option.value}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 border cursor-pointer transition-colors",
                            checked
                              ? "border-primary-500 bg-primary-50"
                              : "border-neutral-200 hover:border-neutral-300",
                          )}
                        >
                          <RadioGroupItem value={option.value} />
                          <span className="text-sm text-neutral-900">{option.label}</span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="primary" className="w-full h-12" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : null}
            Complete profile →
          </Button>
        </form>
      </Form>
    </div>
  );
}
