import { ArrowRight, BookOpen, HeartHandshake, Sprout, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const programmes = [
  {
    title: "Babies",
    age: "3–18 months",
    href: "/programmes/babies",
    icon: HeartHandshake,
    ratio: "1 : 4",
    blurb: "Predictable feeding, sleep, and sensory rhythms in a small, calm room.",
    highlights: ["One-on-one bonding time", "Cot rest with monitoring", "Daily feeding & nappy log"]
  },
  {
    title: "Toddlers",
    age: "18 months – 3 years",
    href: "/programmes/toddlers",
    icon: Sprout,
    ratio: "1 : 6",
    blurb: "Confident small-group play, early language, and gentle independence work.",
    highlights: ["Self-feeding practice", "First social routines", "Outdoor movement daily"]
  },
  {
    title: "Pre-primary",
    age: "3 – 5 years",
    href: "/programmes/pre-primary",
    icon: BookOpen,
    ratio: "1 : 10",
    blurb: "School-ready literacy, numbers, and social confidence through purposeful play.",
    highlights: ["Letter sounds & writing", "Number sense & patterns", "Group work & turn-taking"]
  },
  {
    title: "Aftercare",
    age: "Up to 6 years",
    href: "/programmes/aftercare",
    icon: Sun,
    ratio: "1 : 8",
    blurb: "Quiet rest, healthy snacks, and creative time until you arrive.",
    highlights: ["Homework support", "Afternoon snack", "Calm wind-down time"]
  }
];

export const metadata = { title: "Programmes" };

export default function ProgrammesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Programmes"
        title="Right-sized care for every stage of early childhood."
        description="From three months to six years, every programme is built around what your child is developmentally working on right now — not a one-size-fits-all curriculum."
        actions={<Button href="/visit">Book a tour <ArrowRight className="h-4 w-4" /></Button>}
      />
      <Section>
        <Container size="wide">
          <div className="grid gap-6 md:grid-cols-2">
            {programmes.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.href} href={p.href} interactive className="flex h-full flex-col !p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-paper">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge tone="neutral">Ratio {p.ratio}</Badge>
                  </div>
                  <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted">{p.age}</p>
                  <h2 className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">{p.title}</h2>
                  <p className="mt-3 leading-relaxed text-ink-600">{p.blurb}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-ink-700">
                        <span className="mt-1.5 inline-block h-1 w-1 rounded-full bg-accent" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                    See full programme <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>
      <Section tone="muted" className="border-t border-line">
        <Container>
          <SectionHeader
            eyebrow="A day in the academy"
            title="Calm, predictable, and full of small wins."
            description="Children thrive on rhythm. Here&apos;s the shape of a typical morning, from 07:30 to lunchtime."
            align="center"
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-line rounded-2xl border border-line bg-surface">
            {[
              ["07:30", "Arrival & warm welcome", "Signed in, jacket off, and into the calm corner with a familiar adult."],
              ["08:30", "Free play", "Open-ended materials, books, and quiet corners. Teachers join, never dominate."],
              ["09:30", "Story circle", "Songs, picture cards, and group rhythm. Where language explodes."],
              ["10:00", "Outdoor movement", "Climb, balance, run, rest. Weather-appropriate, every day."],
              ["11:30", "Lunch", "Family-style. Allergies checked twice. Children serve themselves where they can."],
              ["12:30", "Rest time", "Cots, soft music, dim light. We do not rush sleep."]
            ].map(([time, title, body]) => (
              <div key={time} className="grid grid-cols-[80px_1fr] gap-6 p-5 sm:grid-cols-[110px_1fr] sm:p-6">
                <p className="font-mono text-sm text-muted">{time}</p>
                <div>
                  <p className="font-medium text-ink">{title}</p>
                  <p className="mt-1 text-sm text-ink-600">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
