import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/Button";
import { PublicNav } from "@/components/PublicNav";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream">
      <PublicNav />
      <main className="mx-auto flex max-w-md flex-col px-5 py-16">
        <section className="rounded-2xl border border-line bg-white p-6 shadow-soft">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/10 text-terracotta">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-black">Academy login</h1>
          <p className="mt-2 text-sm leading-6 text-muted">Authentication is not connected yet. Use the platform preview to review the private system routes.</p>
          <div className="mt-6 space-y-3">
            <input className="h-11 w-full rounded-xl border border-line bg-cream px-4 text-sm outline-none" placeholder="Email address" />
            <input className="h-11 w-full rounded-xl border border-line bg-cream px-4 text-sm outline-none" placeholder="Password" type="password" />
            <Button className="w-full" href="/app/parent/dashboard">
              Preview parent dashboard
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
