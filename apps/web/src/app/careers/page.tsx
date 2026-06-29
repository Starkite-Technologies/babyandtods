import { ArrowRight, ArrowUpRight, Heart, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const roles = [
  {
    title: "Lead Teacher · Pre-primary",
    type: "Full time",
    location: "Windhoek, on-site",
    summary: "Lead a small Pre-primary class with a co-teacher. ECD qualification and 3+ years experience required.",
    href: "#apply"
  },
  {
    title: "Infant Care Assistant",
    type: "Full time",
    location: "Windhoek, on-site",
    summary: "Support the babies room under the supervision of the lead infant carer. ECD training provided.",
    href: "#apply"
  },
  {
    title: "Kitchen Assistant",
    type: "Part time · mornings",
    location: "Windhoek, on-site",
    summary: "Prepare daily meals to the academy menu under the chef&apos;s supervision. Food safety certificate preferred.",
    href: "#apply"
  }
];

const values = [
  { icon: Heart, title: "We respect the work", body: "ECD is a profession, not a stop-gap. We pay fairly, train continuously, and listen to staff." },
  { icon: Users, title: "Small teams, real voice", body: "Twelve people on the team. Decisions are discussed, not announced." },
  { icon: Sparkles, title: "Calm rooms, calm staff", body: "We design schedules so staff have prep time, breaks, and the energy to be warm at 16:30." }
];

export const metadata = { title: "Careers" };

export default function CareersPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Careers"
        title="Work with us."
        description="If you take early-childhood work seriously and want to be paid, trained, and treated like a professional, we&apos;d love to hear from you."
        actions={<Button href="#roles">See open roles <ArrowRight className="h-4 w-4" /></Button>}
      />

      <Section>
        <Container size="wide">
          <SectionHeader eyebrow="Why here" title="What being on the team is actually like." />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
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

      <Section id="roles" tone="muted" className="border-y border-line">
        <Container size="wide">
          <SectionHeader eyebrow="Open positions" title="Currently hiring." />
          <div className="mt-12 divide-y divide-line rounded-2xl border border-line bg-surface">
            {roles.map((role) => (
              <a key={role.title} href={role.href} className="group flex flex-col gap-3 p-6 transition hover:bg-ink-50/40 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-8">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="neutral">{role.type}</Badge>
                    <Badge tone="neutral">{role.location}</Badge>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-medium tracking-tight text-ink">{role.title}</h3>
                  <p className="mt-1 text-sm text-ink-600">{role.summary}</p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-ink">
                  Apply
                  <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="apply">
        <Container size="narrow">
          <SectionHeader eyebrow="Don&apos;t see your role?" title="Tell us anyway." align="center" />
          <p className="mx-auto mt-4 max-w-xl text-center text-ink-600">
            We keep a small bank of CVs for substitute and future roles. If you&apos;d like to be considered, email{" "}
            <a className="link-underline font-medium text-ink" href="mailto:careers@babiesandtods.com">
              careers@babiesandtods.com
            </a>{" "}
            with your CV and a short note about why this work matters to you.
          </p>
        </Container>
      </Section>
    </PublicShell>
  );
}
