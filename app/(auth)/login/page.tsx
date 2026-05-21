"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Github, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "@/lib/auth-client";

const SignInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters"),
});

type SignInInput = z.infer<typeof SignInSchema>;

const GOOGLE_ENABLED = !!process.env.NEXT_PUBLIC_GOOGLE_ENABLED || true;
const GITHUB_ENABLED = !!process.env.NEXT_PUBLIC_GITHUB_ENABLED || true;

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirectTo = search.get("redirect") ?? "/";
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignInInput) {
    setLoading(true);
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: redirectTo,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message ?? "Could not sign in");
      return;
    }
    toast.success("Welcome back");
    router.push(redirectTo);
    router.refresh();
  }

  async function onOAuth(provider: "github" | "google") {
    setOauthLoading(provider);
    await signIn.social({
      provider,
      callbackURL: redirectTo,
    });
    // page redirects; if not, surface error
    setOauthLoading(null);
  }

  return (
    <div className="bg-neutral-0 border border-neutral-200 p-8 sm:p-10">
      <div className="mb-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary-500">
          Sign in
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-900">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          The community hub for Rwandan React developers.
        </p>
      </div>

      <div className="space-y-3">
        {GITHUB_ENABLED && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={oauthLoading !== null}
            onClick={() => onOAuth("github")}
          >
            {oauthLoading === "github" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Github strokeWidth={1.5} />
            )}
            Continue with GitHub
          </Button>
        )}
        {GOOGLE_ENABLED && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={oauthLoading !== null}
            onClick={() => onOAuth("google")}
          >
            {oauthLoading === "google" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </Button>
        )}
      </div>

      <div className="relative my-6 flex items-center">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="px-3 text-[11px] uppercase tracking-[0.08em] text-neutral-400">
          or with email
        </span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="dev@example.rw"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold uppercase tracking-[0.08em] text-neutral-700">
                  Password
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="primary" className="w-full h-12" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : null}
            Sign in
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-primary-500 hover:text-primary-600 font-medium"
        >
          Join →
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}
