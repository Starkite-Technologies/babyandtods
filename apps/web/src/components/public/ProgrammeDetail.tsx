import type { ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { cn } from "@/lib/cn";

export type Programme = {
  name: string;
  age: string;
  ratio: string;
  tagline: string;
  description: string;
  hours: string;
  meals: string;
  pillars: { title: string; body: string }[];
  daily: { time: string; title: string; body: string }[];
  faqs: { q: string; a: string }[];
  cta?: ReactNode;
};

const iconTones = ["bg-terracotta", "bg-sunset", "bg-sage", "bg-sky"];
const timeTones = ["text-terracotta", "text-sunset", "text-sage", "text-sky"];

export function ProgrammeDetail({ programme }: { programme: Programme }) {
  return (
    <PublicShell>
      <PageHero
        eyebrow={`Programme · ${programme.age}`}
        title={programme.name}
        description={programme.description}
        actions={
          <>
            <Button href="/admissions">Apply <ArrowRight className="h-4 w-4" /></Button>
            <Button href="/visit" variant="secondary">Book a tour</Button>
          </>
        }
        meta={
          <div className="grid max-w-2xl gap-4 sm:grid-cols-4">
            <MetaTile label="Age" value={programme.age} />
            <MetaTile label="Ratio" value={programme.ratio} />
            <MetaTile label="Hours" value={programme.hours} />
            <MetaTile label="Meals" value={programme.meals} />
          </div>
        }
      />

      <Section>
        <Container>
          <SectionHeader eyebrow="What this programme builds" title={programme.tagline} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {programme.pillars.map((p, index) => (
              <Card
                key={p.title}
                className="border-sand/80 bg-gradient-to-br from-white to-sand/20"
              >
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-paper", iconTones[index % iconTones.length])}>
                  <Check className="h-4 w-4" />
                </div>
                <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{p.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-y border-sand/80 !bg-sand/30">
        <Container>
          <SectionHeader eyebrow="A typical day" title="Predictable rhythm, room for spontaneity." />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-sand rounded-2xl border border-sand bg-surface">
            {programme.daily.map((d, index) => (
              <div key={d.time} className="grid grid-cols-[80px_1fr] gap-6 p-5 sm:grid-cols-[110px_1fr] sm:p-6">
                <p className={cn("font-mono text-sm font-semibold", timeTones[index % timeTones.length])}>{d.time}</p>
                <div>
                  <p className="font-medium text-ink">{d.title}</p>
                  <p className="mt-1 text-sm text-ink-600">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <SectionHeader eyebrow="Common questions" title="What parents usually ask." />
          <div className="mt-12 divide-y divide-line border-y border-line">
            {programme.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <span className="font-medium text-ink">{f.q}</span>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-ink group-open:text-ink">
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-600">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-plum text-paper">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge tone="accent">Limited places</Badge>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tighter sm:text-4xl">
                Ready to enrol in {programme.name}?
              </h2>
              <p className="mt-3 max-w-md text-paper/70">
                A short application, a tour, and a meet-and-greet with the lead teacher. That&apos;s it.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/admissions" variant="accent">Start admissions</Button>
              <Button href="/contact" variant="outline" className="!border-paper/30 !text-paper hover:!bg-paper hover:!text-ink">Ask a question</Button>
            </div>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}

function MetaTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-sand/80 bg-surface/95 p-4 shadow-soft">
      <p className="text-[10px] font-medium uppercase tracking-wider text-terracotta">{label}</p>
      <p className="mt-1 font-display text-lg text-ink">{value}</p>
    </div>
  );
}
