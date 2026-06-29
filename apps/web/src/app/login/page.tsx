import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in" };

async function loginAction(formData: FormData) {
  "use server";

  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  let result: { token: string; user: { role: string } } | null = null;

  try {
    const apiUrl = process.env.API_URL ?? "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store"
    });

    if (res.ok) {
      result = await res.json();
    }
  } catch {
    // network error — fall through to error redirect
  }

  if (!result) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set("auth", result.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  const role = result.user.role;
  const segment = role === "parent" ? "parent" : role === "teacher" ? "teacher" : "admin";
  redirect(`/app/${segment}/dashboard`);
}

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-ink transition hover:text-terracotta">
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            <span className="inline-block h-px w-6 bg-terracotta" />
            Sign in
          </p>
          <h1 className="mt-4 font-display text-4xl font-medium tracking-tighter text-ink">Welcome back.</h1>
          <p className="mt-3 text-ink-600">Sign in to your Babies &amp; Todd&apos;s Academy account.</p>

          {error && (
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Incorrect email or password. Please try again.
            </div>
          )}

          <form action={loginAction} className="mt-8 space-y-4">
            <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
            <Input label="Password" name="password" type="password" placeholder="••••••••" required />
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-ink-600">
                <input type="checkbox" className="h-4 w-4 rounded border-line accent-ink" />
                Remember me
              </label>
              <Link className="link-underline font-medium text-ink" href="/contact">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Sign in <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            New family?{" "}
            <Link className="link-underline font-medium text-ink" href="/admissions">
              Start admissions
            </Link>
          </p>
        </div>

        <p className="text-xs text-muted">© {new Date().getFullYear()} Babies &amp; Todd&apos;s Academy</p>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-sand via-paper to-sky/20 lg:block">
        <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
        <div className="absolute -left-20 top-14 h-56 w-56 rounded-full border-[34px] border-sunset/20" aria-hidden />
        <div className="absolute -right-16 bottom-12 h-48 w-48 rounded-full bg-coral/20 blur-3xl" aria-hidden />
        <div className="absolute inset-0 flex flex-col justify-between p-16">
          <div className="flex justify-center pt-4">
            <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full border border-sand/80 bg-surface/55 shadow-lift backdrop-blur-sm">
              <div className="absolute inset-8 rounded-full border border-sunset/20" aria-hidden />
              <Image
                src="/images/babies-todds-academy-logo.png"
                alt="Babies and Todd's Academy logo"
                width={505}
                height={570}
                priority
                className="relative h-80 w-80 rounded-full bg-white object-contain p-2 drop-shadow-2xl"
              />
              <span className="absolute right-8 top-16 h-7 w-7 animate-bounce-soft rounded-full bg-sunset shadow-soft" />
              <span className="absolute bottom-12 left-16 h-4 w-4 animate-bounce-soft rounded-full bg-coral shadow-soft [animation-delay:900ms]" />
            </div>
          </div>
          <div className="mx-auto max-w-xl rounded-3xl border border-sand/80 bg-surface/70 p-8 shadow-soft backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-terracotta">A note from us</p>
            <blockquote className="mt-5 font-display text-3xl font-medium leading-tight tracking-tighter text-ink">
              &ldquo;Trust is built in small, daily moments - a calm handover, a clear report, a warm reply at 14:05.&rdquo;
            </blockquote>
            <p className="mt-5 text-sm text-muted">Assumpta SM Gahutu · Founder &amp; Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
