import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { acceptInvitationAction } from "@/lib/actions";
import { dashboardFor } from "@/lib/auth";

export const metadata = { title: "Accept invitation" };

async function acceptInvite(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!token) {
    redirect("/login");
  }

  if (password.length < 8) {
    redirect(`/invite/${token}?error=password`);
  }

  if (password !== confirm) {
    redirect(`/invite/${token}?error=match`);
  }

  const result = await acceptInvitationAction({ token, password });
  if (!result.ok) {
    redirect(`/invite/${token}?error=${encodeURIComponent(result.message ?? "invalid")}`);
  }

  redirect(dashboardFor(result.role ?? "teacher"));
}

export default async function InvitePage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-paper lg:grid-cols-[0.95fr_1.05fr]">
      <div className="aurora" aria-hidden>
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
      </div>

      <section className="relative z-10 flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-12">
        <Link href="/" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-ink transition hover:text-brand-blue">
          <ArrowLeft className="h-4 w-4" />
          Back to website
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <div className="mb-6">
            <Image
              src="/images/babies-todds-academy-logo.png"
              alt="Babies and Todd's Academy logo"
              width={120}
              height={120}
              className="h-20 w-20 rounded-full bg-white object-contain p-1 shadow-lift"
              priority
            />
          </div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-purple">
            <ShieldCheck className="h-4 w-4" />
            Secure invitation
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tighter text-ink">Create your portal password.</h1>
          <p className="mt-3 text-ink-600">
            This account was created by the academy admin. Set your password to accept the invitation.
          </p>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {inviteErrorMessage(error)}
            </div>
          )}

          <form action={acceptInvite} className="mt-8 space-y-4">
            <input type="hidden" name="token" value={token} />
            <Input label="Password" name="password" type="password" placeholder="At least 8 characters" required />
            <Input label="Confirm password" name="confirm" type="password" placeholder="Repeat password" required />
            <Button type="submit" className="w-full">
              Accept invitation <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            Already accepted?{" "}
            <Link className="link-underline font-medium text-ink" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <section className="relative z-10 hidden items-center justify-center p-10 lg:flex">
        <div className="glass-strong max-w-xl rounded-[2rem] p-8">
          <Image
            src="/images/babies-todds-academy-logo.png"
            alt="Babies and Todd's Academy"
            width={700}
            height={520}
            className="mx-auto w-full max-w-sm rounded-full bg-white object-contain p-2 shadow-lift"
          />
          <blockquote className="mt-8 font-display text-3xl font-semibold leading-tight text-ink">
            Welcome to the academy portal. Access is created and approved by the school, never by public self-registration.
          </blockquote>
        </div>
      </section>
    </main>
  );
}

function inviteErrorMessage(error: string) {
  const decoded = decodeURIComponent(error);
  if (decoded === "password") return "Password must be at least 8 characters.";
  if (decoded === "match") return "Both passwords must match.";
  if (decoded.toLowerCase().includes("expired")) return "This invitation link has expired. Ask the academy admin to send a new invitation.";
  if (decoded.toLowerCase().includes("already")) return "This invitation has already been accepted. Please sign in instead.";
  if (decoded.toLowerCase().includes("valid admission")) return decoded;
  if (decoded.toLowerCase().includes("invalid invitation")) return "This invitation is no longer valid. The account may have been deleted or the admin needs to send a fresh invite.";
  return decoded || "The invitation could not be accepted. Please ask the academy admin to send a fresh invite.";
}
