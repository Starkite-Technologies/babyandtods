import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const tiers = [
  {
    name: "Babies",
    age: "3–18 months",
    monthly: "N$ 3 200",
    daily: "N$ 180 / day ad-hoc",
    includes: ["Full-day care 07:00–17:30", "Meals & snacks", "Nappies & wipes provided", "Daily report & photos"],
    href: "/programmes/babies"
  },
  {
    name: "Toddlers",
    age: "18m – 3 years",
    monthly: "N$ 2 850",
    daily: "N$ 165 / day ad-hoc",
    includes: ["Full-day care 07:00–17:30", "Meals & snacks", "Outdoor & creative materials", "Daily report & photos"],
    href: "/programmes/toddlers",
    featured: true
  },
  {
    name: "Pre-primary",
    age: "3 – 5 years",
    monthly: "N$ 2 650",
    daily: "N$ 155 / day ad-hoc",
    includes: ["Full-day care 07:00–17:30", "Meals & snacks", "Learning materials", "Weekly learning summary"],
    href: "/programmes/pre-primary"
  },
  {
    name: "Aftercare",
    age: "Up to 6 years",
    monthly: "N$ 1 250",
    daily: "N$ 95 / day ad-hoc",
    includes: ["14:00–17:30 care", "Afternoon snack", "Optional homework support", "Daily pickup note"],
    href: "/programmes/aftercare"
  }
];

const extras = [
  ["Registration (once-off)", "N$ 950"],
  ["Sibling discount", "10 % from second child"],
  ["Holiday programme", "N$ 130 / day"],
  ["Late pickup (after 17:45)", "N$ 50 per 15 min"]
];

export const metadata = { title: "Fees" };

export default function FeesPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Fees & billing"
        title="Simple monthly fees. No hidden extras."
        description="Tuition is billed monthly in advance. Meals, materials, daily reports, and the family platform are included — no à la carte surprises."
        actions={
          <>
            <Button href="/admissions">Apply <ArrowRight className="h-4 w-4" /></Button>
            <Button href="/contact" variant="secondary">Ask about discounts</Button>
          </>
        }
      />

      <Section>
        <Container size="wide">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => (
              <Card key={tier.name} className={tier.featured ? "border-ink !bg-ink !text-paper" : ""}>
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-medium uppercase tracking-wider ${tier.featured ? "text-paper/60" : "text-muted"}`}>{tier.age}</p>
                  {tier.featured && <Badge tone="accent">Popular</Badge>}
                </div>
                <h3 className={`mt-2 font-display text-2xl font-medium tracking-tight ${tier.featured ? "text-paper" : "text-ink"}`}>{tier.name}</h3>
                <p className={`mt-6 font-display text-4xl font-medium tracking-tighter ${tier.featured ? "text-paper" : "text-ink"}`}>
                  {tier.monthly}
                  <span className={`ml-1 text-sm font-normal ${tier.featured ? "text-paper/60" : "text-muted"}`}>/ month</span>
                </p>
                <p className={`mt-1 text-xs ${tier.featured ? "text-paper/60" : "text-muted"}`}>or {tier.daily}</p>
                <ul className="mt-6 space-y-2.5">
                  {tier.includes.map((item) => (
                    <li key={item} className={`flex items-start gap-2.5 text-sm ${tier.featured ? "text-paper/85" : "text-ink-700"}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-paper" : "text-ink"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  href={tier.href}
                  variant={tier.featured ? "accent" : "secondary"}
                  className="mt-6 w-full"
                >
                  See programme
                </Button>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-y border-line">
        <Container size="narrow">
          <SectionHeader eyebrow="Extras & discounts" title="The small print." />
          <div className="mt-10 divide-y divide-line rounded-2xl border border-line bg-surface">
            {extras.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 p-5">
                <p className="font-medium text-ink">{label}</p>
                <p className="font-mono text-sm text-ink-700">{value}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="narrow">
          <SectionHeader eyebrow="How billing works" title="Predictable, paperless, on time." />
          <ol className="mt-10 space-y-4">
            {[
              "Invoice issued by the 25th of the prior month, visible in the parent app.",
              "Payment due by the 1st via EFT or card.",
              "Receipts auto-generated and stored in your billing history.",
              "Annual statement available on request for tax or employer claims."
            ].map((s, i) => (
              <li key={s} className="flex gap-4 rounded-xl border border-line bg-surface p-5">
                <span className="font-mono text-sm text-muted">0{i + 1}</span>
                <p className="text-ink-700">{s}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </PublicShell>
  );
}
