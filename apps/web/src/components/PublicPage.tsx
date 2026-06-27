import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./Button";
import { PublicNav } from "./PublicNav";

export function PublicPage({
  eyebrow,
  title,
  summary,
  children
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <PublicNav />
      <main>
        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-terracotta">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-deep md:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{summary}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/admissions">
                Admissions <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/app/parent/dashboard" variant="secondary">
                View platform
              </Button>
            </div>
          </div>
          <div className="min-h-[320px] rounded-[28px] bg-[radial-gradient(circle_at_20%_20%,#F4E3C4_0_18%,transparent_19%),linear-gradient(135deg,#C2552D,#E8A33D)] p-5 text-white shadow-soft">
            <div className="flex h-full flex-col justify-end rounded-2xl border border-white/25 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-white/75">Windhoek early learning</p>
              <p className="mt-3 text-3xl font-black">Small hands, steady routines, bright records.</p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-5 pb-14">{children}</section>
      </main>
    </div>
  );
}
