import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const values = [
  {
    icon: HeartHandshake,
    title: "Warm before structured",
    body: "A safe relationship comes first. Skills come next. We never reverse that order."
  },
  {
    icon: ShieldCheck,
    title: "Honest with families",
    body: "If something happened, you hear it from us — clearly, and on the same day."
  },
  {
    icon: Sparkles,
    title: "Curious by design",
    body: "Open-ended materials, mixed indoor and outdoor time, and real conversations beat screens."
  },
  {
    icon: Users,
    title: "Small enough to know everyone",
    body: "Low ratios mean staff genuinely know each child's rhythm, fears, and favorite jokes."
  }
];

const milestones = [
  { year: "2013", title: "Founded", body: "The academy opens with a single classroom of six toddlers." },
  { year: "2017", title: "Pre-primary added", body: "School-readiness programme launches for ages 3–5." },
  { year: "2021", title: "Babies room", body: "Dedicated infant care opens with low ratios and qualified staff." },
  { year: "2024", title: "Family platform", body: "A connected system brings real-time updates to every parent." },
  { year: "2026", title: "Today", body: "77 children across five classrooms, with families across Windhoek." }
];

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="About the academy"
        title="A small, private academy with a big sense of responsibility."
        description="We&apos;ve spent more than a decade building the kind of early-years space we wanted for our own children — calm, attentive, honest, and joyfully curious."
        actions={
          <>
            <Button href="/visit">Book a tour <ArrowRight className="h-4 w-4" /></Button>
            <Button href="/programmes" variant="secondary">See programmes</Button>
          </>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div className="space-y-6 text-lg leading-relaxed text-ink-700">
              <p>
                Babies &amp; Todd&apos;s Academy was founded in Windhoek with a simple belief: in the first six years of life, the small, ordinary moments are the curriculum.
              </p>
              <p>
                The way a child is greeted at the door. The voice the room uses at lunchtime. Whether the grown-ups bend down to listen, or speak from above. These are the things that shape a brain — far more than any flashcard.
              </p>
              <p>
                Our staff are qualified, vetted, and continuously trained. Our routines are predictable on purpose. Our communication with families is direct, honest, and same-day. And our platform exists for one reason: so that nothing important is ever lost between us and you.
              </p>
            </div>
            <Card className="!p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">A note from the director</p>
              <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-ink">
                &ldquo;Every child who walks through our door belongs to a family who has trusted us with the years they cannot get back. That trust shapes every decision we make.&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper font-display">A</div>
                <div>
                  <p className="font-medium text-ink">Assumpta SM Gahutu</p>
                  <p className="text-sm text-muted">Founder &amp; Director</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-y border-line">
        <Container>
          <SectionHeader
            eyebrow="What we hold to"
            title="Four commitments, every single day."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.title}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-paper">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-medium tracking-tight text-ink">{v.title}</h3>
                  <p className="mt-2 text-ink-600">{v.body}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeader eyebrow="Our story" title="Twelve years, one promise." />
          <div className="mt-12 grid gap-y-0 sm:grid-cols-[140px_1fr]">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                className="contents"
              >
                <div className="border-t border-line py-6 font-mono text-sm text-muted">{m.year}</div>
                <div className="border-t border-line py-6">
                  <p className="font-display text-xl font-medium tracking-tight text-ink">{m.title}</p>
                  <p className="mt-1 text-ink-600">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="dark">
        <Container>
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-medium tracking-tighter sm:text-4xl">Come see for yourself.</h2>
              <p className="mt-3 max-w-md text-paper/70">A 45-minute walkthrough of a real morning. No sales talk.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/visit" variant="accent">Book a tour</Button>
              <Button href="/admissions" variant="outline" className="!border-paper/30 !text-paper hover:!bg-paper hover:!text-ink">Apply</Button>
            </div>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
