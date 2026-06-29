import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const expectations = [
  { title: "A real morning", body: "Tours run between 09:00 and 10:30 — the busiest, most honest part of our day." },
  { title: "No sales talk", body: "You meet teachers, see the rooms, ask any question. We don&apos;t hand out brochures." },
  { title: "45 minutes", body: "Enough time to see what you need, not so long that you lose your afternoon." },
  { title: "Kids welcome", body: "Bring them. We want to see how they react to the space — and how the space reacts to them." }
];

const slots = [
  { day: "Tuesday", date: "01 Jul", time: "09:00 · 09:45 · 10:30" },
  { day: "Wednesday", date: "02 Jul", time: "09:00 · 09:45 · 10:30" },
  { day: "Friday", date: "04 Jul", time: "09:00 · 09:45" },
  { day: "Tuesday", date: "08 Jul", time: "09:00 · 09:45 · 10:30" }
];

export const metadata = { title: "Visit us" };

export default function VisitPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Visit us"
        title="Book a tour. See a real morning."
        description="Pick a slot below and we&apos;ll confirm within the day. Tours are 45 minutes, and we&apos;d genuinely rather you saw the busy part of our day than the quiet one."
        actions={<Button href="#book">Book a tour <ArrowRight className="h-4 w-4" /></Button>}
      />

      <Section>
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <SectionHeader eyebrow="What to expect" title="A small, honest visit." />
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {expectations.map((e) => (
                  <div key={e.title} className="rounded-2xl border border-line bg-surface p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-50 text-ink">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <p className="mt-4 font-medium text-ink">{e.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{e.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="!p-8">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Where</p>
              <p className="mt-1 inline-flex items-center gap-2 font-display text-xl font-medium tracking-tight text-ink">
                <MapPin className="h-4 w-4" /> Windhoek, Namibia
              </p>
              <p className="mt-1 text-sm text-muted">Exact address shared on confirmation.</p>

              <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted">When</p>
              <p className="mt-1 inline-flex items-center gap-2 font-display text-xl font-medium tracking-tight text-ink">
                <Clock className="h-4 w-4" /> Tue · Wed · Fri mornings
              </p>
              <p className="mt-1 text-sm text-muted">09:00, 09:45, or 10:30 slots.</p>

              <div className="mt-8 border-t border-line pt-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Upcoming open slots</p>
                <ul className="mt-3 space-y-2">
                  {slots.map((s) => (
                    <li key={s.date} className="flex items-center justify-between rounded-xl bg-paper px-3 py-2.5">
                      <p className="text-sm font-medium text-ink">{s.day} <span className="text-muted">· {s.date}</span></p>
                      <p className="font-mono text-xs text-muted">{s.time}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="book" tone="muted" className="border-y border-line">
        <Container size="narrow">
          <SectionHeader eyebrow="Book your tour" title="Tell us a little, and we&apos;ll confirm." align="center" />
          <form className="mt-12 space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Your name" name="name" required />
              <Input label="Phone" name="phone" type="tel" required />
            </div>
            <Input label="Email" name="email" type="email" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Child's age" name="childAge" placeholder="e.g. 2y 4m" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-ink">Preferred slot</label>
                <select
                  name="slot"
                  className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/5"
                >
                  {slots.map((s) =>
                    s.time.split(" · ").map((t) => (
                      <option key={s.date + t}>{s.day} {s.date} · {t}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <Textarea label="Anything we should know?" name="notes" placeholder="Programme interest, accessibility needs…" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <p className="text-xs text-muted">We confirm within one working day.</p>
              <Button type="submit">Request slot <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </form>
        </Container>
      </Section>
    </PublicShell>
  );
}
