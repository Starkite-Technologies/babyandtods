import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  HeartHandshake,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Sprout,
  Sun,
  BookOpen,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";

const programmes = [
  {
    title: "Babies",
    age: "3–18 months",
    href: "/programmes/babies",
    icon: HeartHandshake,
    blurb: "Warm one-on-one care with predictable feeding, sleep, and sensory rhythms."
  },
  {
    title: "Toddlers",
    age: "18 months – 3 years",
    href: "/programmes/toddlers",
    icon: Sprout,
    blurb: "Confident small-group play, early language, and gentle independence work."
  },
  {
    title: "Pre-primary",
    age: "3 – 5 years",
    href: "/programmes/pre-primary",
    icon: BookOpen,
    blurb: "School-ready literacy, numbers, and social confidence through purposeful play."
  },
  {
    title: "Aftercare",
    age: "Up to 6 years",
    href: "/programmes/aftercare",
    icon: Sun,
    blurb: "Quiet rest, healthy snacks, and creative time for working families."
  }
];

const platformFeatures = [
  {
    icon: CalendarCheck2,
    title: "Daily reports",
    body: "Every meal, nap, mood, and milestone reaches you the same day — not on Friday."
  },
  {
    icon: MessageCircle,
    title: "Direct messaging",
    body: "Talk to your child's lead teacher without phone tag or lost notes."
  },
  {
    icon: ShieldCheck,
    title: "Verified pickup",
    body: "Authorized people only. Every check-in and pickup is logged and signed."
  },
  {
    icon: Sparkles,
    title: "Learning timeline",
    body: "See your child's growth across language, movement, social, and number domains."
  }
];

const principles = [
  {
    n: "01",
    title: "Calm routines",
    body: "Children thrive on predictable rhythms. Our day is structured so transitions feel safe."
  },
  {
    n: "02",
    title: "Small groups",
    body: "Low ratios mean every child is seen, heard, and known — by name, by need, by mood."
  },
  {
    n: "03",
    title: "Clear records",
    body: "Parents and staff share the same source of truth: today's report, today's pickup, today's note."
  },
  {
    n: "04",
    title: "Warm staff",
    body: "Qualified, vetted, and continuously trained. The grown-ups in the room set the tone."
  }
];

export default function HomePage() {
  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-60" aria-hidden />
        <Container size="wide" className="relative pb-20 pt-12 sm:pt-16 lg:pb-28 lg:pt-24">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-xs font-medium text-ink-600 backdrop-blur transition hover:border-ink/30 hover:text-ink animate-fade-in"
              >
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
                Now enrolling for the 2027 term
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <h1 className="mt-6 font-display text-[44px] font-medium leading-[1.05] tracking-tighter text-ink animate-fade-in sm:text-6xl lg:text-7xl">
                A gentle start to a{" "}
                <span className="relative inline-block">
                  big life
                  <span className="absolute -bottom-1 left-0 right-0 h-2 origin-left animate-[fade-in_0.6s_ease-out_0.6s_both] rounded-full bg-accent/30" />
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 animate-fade-in-slow">
                A private early-learning academy in Windhoek for babies, toddlers, and pre-primary children — warm classrooms, structured routines, and a connected platform that keeps families in the loop every single day.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 animate-fade-in-slow">
                <Button href="/admissions" size="lg">
                  Start admissions <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/visit" variant="secondary" size="lg">
                  Book a tour
                </Button>
              </div>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6 animate-fade-in-slow">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Children</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">77</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Classrooms</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">5</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Years caring</dt>
                  <dd className="mt-1 font-display text-2xl text-ink">12+</dd>
                </div>
              </dl>
            </div>
            <div className="relative animate-fade-in-slow">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-sand/70 via-paper to-sky/20 ring-1 ring-sand shadow-lift">
                <div className="absolute inset-0 bg-grid opacity-55" aria-hidden />
                <div className="absolute -right-16 -top-16 h-40 w-40 animate-soft-spin rounded-full border-[22px] border-sunset/25" aria-hidden />
                <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-coral/20 blur-2xl" aria-hidden />
                <Image
                  src="/images/academy-hero-cutout.png?v=2"
                  alt="Babies and Todd's Academy children illustration"
                  width={1378}
                  height={784}
                  priority
                  className="absolute left-1/2 top-[52%] z-0 w-[112%] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-2xl"
                />
                <div className="absolute left-6 right-6 top-6 z-10 flex items-start justify-between gap-3">
                  <Badge tone="accent" className="!rounded-full">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-accent" /> Live today
                  </Badge>
                  <div className="rounded-2xl border border-line bg-surface/90 px-4 py-3 shadow-soft backdrop-blur">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted">Today</p>
                    <p className="mt-1 font-display text-2xl text-ink">92%</p>
                    <p className="text-[10px] text-muted">attendance</p>
                  </div>
                </div>
                <div className="hidden">
                  <Card className="!p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <CalendarCheck2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">Amara arrived at 08:12</p>
                        <p className="text-xs text-muted">Checked in by Maria · Sunshine class</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="!p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 text-accent">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">New milestone</p>
                        <p className="text-xs text-muted">Recognized three new picture cards</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="!p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
                        <MessageCircle className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">Teacher Johanna</p>
                        <p className="truncate text-xs text-muted">She joined story circle with confidence ✨</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Programmes */}
      <Section tone="default" className="border-t border-line">
        <Container size="wide">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Programmes"
              title="Right-sized care for every age."
              description="From three months to six years, every programme is built around the developmental work your child is actually doing right now."
            />
            <Button href="/programmes" variant="ghost" size="sm">
              All programmes <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {programmes.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.href} href={p.href} interactive className="flex h-full flex-col">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-50 text-ink transition group-hover:bg-ink group-hover:text-paper">
                      <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-ink-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">{p.age}</p>
                  <h3 className="mt-1 font-display text-xl font-medium tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{p.blurb}</p>
                  <p className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    Explore programme <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Platform / app showcase */}
      <Section tone="dark">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-paper/50">
                <span className="inline-block h-px w-6 bg-paper/30" />
                The platform
              </p>
              <h2 className="mt-4 font-display text-4xl font-medium tracking-tighter text-paper sm:text-5xl">
                Your child&apos;s day, on your phone — by the time they nap.
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-paper/70">
                Most childcare communication is &quot;ask when you pick up.&quot; Ours isn&apos;t. Parents see check-in, meals, naps, mood, photos, and learning notes the moment they happen.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {platformFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="rounded-2xl border border-paper/10 bg-paper/[0.03] p-4 transition hover:border-paper/25 hover:bg-paper/[0.06]">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-paper/10 text-paper">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="mt-3 text-sm font-medium text-paper">{f.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-paper/60">{f.body}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/app/parent/dashboard" variant="accent">
                  Preview parent app <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href="/login" variant="outline" className="!border-paper/20 !text-paper hover:!bg-paper hover:!text-ink">
                  Sign in
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-paper/10 bg-paper/5 p-2 shadow-2xl">
                <div className="overflow-hidden rounded-2xl border border-paper/10 bg-ink">
                  <div className="flex items-center gap-2 border-b border-paper/10 bg-paper/[0.03] px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-paper/20" />
                    <span className="ml-3 font-mono text-[10px] text-paper/40">parent · today · 14:05</span>
                  </div>
                  <div className="space-y-3 p-4">
                    <MockRow label="Arrived" value="08:12" tone="ok" />
                    <MockRow label="Breakfast" value="Oats + fruit" />
                    <MockRow label="Story circle" value="3 new cards" tone="accent" />
                    <MockRow label="Outdoor movement" value="40m" />
                    <MockRow label="Lunch" value="Allergy ✓" tone="ok" />
                    <MockRow label="Nap" value="1h 10m" />
                    <MockRow label="Mood" value="Curious" tone="accent" />
                    <div className="!mt-4 rounded-xl border border-paper/10 bg-paper/[0.04] p-3">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-paper/40">Teacher note</p>
                      <p className="mt-1 text-sm text-paper">
                        Shared blocks with a friend and counted to five aloud during snack time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Principles */}
      <Section>
        <Container size="wide">
          <SectionHeader
            eyebrow="What we believe"
            title="Four things we get right, every day."
            description="There are no shortcuts in early years — these are the small commitments that compound into a thriving childhood."
          />
          <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {principles.map((p) => (
              <div key={p.n} className="group flex gap-6 border-t border-line pt-8 transition hover:border-ink/40">
                <span className="font-mono text-sm text-muted">{p.n}</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-medium tracking-tight text-ink">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Testimonial / pull quote */}
      <Section tone="muted" className="border-y border-line">
        <Container>
          <figure className="text-center">
            <Sparkles className="mx-auto h-5 w-5 text-accent" />
            <blockquote className="mt-6 font-display text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              &ldquo;I know what my daughter ate, who hugged her, and what made her laugh — before I&apos;ve even left the office.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-sm text-muted">
              Maria Shikongo · Amara&apos;s mother · Sunshine class
            </figcaption>
          </figure>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-ink p-8 text-paper sm:p-12 lg:p-16">
            <div className="absolute inset-0 bg-grid opacity-10" aria-hidden />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-paper/50">
                  Visit before you decide
                </p>
                <h2 className="mt-4 font-display text-4xl font-medium tracking-tighter sm:text-5xl">
                  Walk through a real morning at the academy.
                </h2>
                <p className="mt-4 text-paper/70">
                  Forty-five minutes. You meet the lead teachers, see the classrooms, and we answer every question.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/visit" variant="accent" size="lg">
                  Book a tour <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/contact"
                  variant="outline"
                  size="lg"
                  className="!border-paper/30 !text-paper hover:!bg-paper hover:!text-ink"
                >
                  Get in touch
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}

function MockRow({
  label,
  value,
  tone = "default"
}: {
  label: string;
  value: string;
  tone?: "default" | "ok" | "accent";
}) {
  const v =
    tone === "ok"
      ? "text-emerald-300"
      : tone === "accent"
      ? "text-accent-300"
      : "text-paper";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-paper/5 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-paper/50">{label}</span>
      <span className={`font-mono text-xs ${v}`}>{value}</span>
    </div>
  );
}
