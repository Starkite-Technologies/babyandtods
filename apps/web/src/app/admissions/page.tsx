import { ArrowRight, Check, FileText, MessageSquare, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea } from "@/components/ui/Input";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";
import { submitAdmissionAction } from "@/lib/actions";

const steps = [
  {
    n: "01",
    icon: Phone,
    title: "Get in touch",
    body: "A short call or message to understand your child's age, your hours, and what you're looking for.",
    cta: { label: "Call now", href: "tel:+264000000000" }
  },
  {
    n: "02",
    icon: Sparkles,
    title: "Visit the academy",
    body: "Forty-five minutes. You meet the teachers, see the classrooms, and watch a real morning unfold.",
    cta: { label: "Book a tour", href: "/visit" }
  },
  {
    n: "03",
    icon: FileText,
    title: "Submit application",
    body: "A simple online form creates an application for admin review. It never creates an account automatically.",
    cta: { label: "Open form", href: "#apply" }
  },
  {
    n: "04",
    icon: MessageSquare,
    title: "Offer and settling-in plan",
    body: "We confirm a place and agree a gentle settling-in plan with the lead teacher of the room.",
    cta: { label: "What to expect", href: "/faq" }
  }
];

const documents = [
  "Child's full birth certificate",
  "Immunization record",
  "Two recent passport photos",
  "Parent / guardian ID copies",
  "Two emergency contact numbers",
  "Doctor's letter for any allergies or chronic conditions"
];

export const metadata = { title: "Admissions" };

export default async function AdmissionsPage({ searchParams }: { searchParams?: Promise<{ submitted?: string }> }) {
  const params = await searchParams;
  const submitted = params?.submitted;

  return (
    <PublicShell>
      <PageHero
        eyebrow="Admissions"
        title="From first call to first day, in four clear steps."
        description="Admissions start as an application only. The academy reviews every family before a learner profile or parent account is created."
        actions={
          <>
            <Button href="#apply">Start application <ArrowRight className="h-4 w-4" /></Button>
            <Button href="/visit" variant="secondary">Book a tour first</Button>
          </>
        }
      />

      <Section>
        <Container size="wide">
          <SectionHeader eyebrow="The process" title="Application first, learner profile after approval." />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.n} className="flex h-full flex-col !p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-50 text-ink">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-sm text-muted">{step.n}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-ink">{step.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-ink-600">{step.body}</p>
                  <Button href={step.cta.href} variant="ghost" size="sm" className="mt-6 self-start !px-0">
                    {step.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-y border-line">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <Badge tone="neutral">Documents</Badge>
              <h2 className="mt-4 font-display text-3xl font-medium tracking-tighter text-ink sm:text-4xl">
                What to have ready.
              </h2>
              <p className="mt-4 text-ink-600">
                You do not need everything to apply. The office will request final documents before the first day.
              </p>
            </div>
            <ul className="space-y-3">
              {documents.map((doc) => (
                <li key={doc} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-ink">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section id="apply">
        <Container size="narrow">
          <SectionHeader
            eyebrow="Apply now"
            title="A few questions, two minutes."
            description="The admin team reviews every application before creating any learner or parent account."
            align="center"
          />
          {submitted === "1" && (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Your application has been received. The academy team will review it and contact you with the next step.
            </div>
          )}
          {submitted === "0" && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              We could not submit the application. Please check the required fields and try again.
            </div>
          )}
          <form action={submitAdmissionAction} className="mt-12 space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Parent / guardian name" name="parentName" placeholder="Full name" required />
              <Input label="Phone" name="parentPhone" type="tel" placeholder="+264 ..." required />
            </div>
            <Input label="Email" name="parentEmail" type="email" placeholder="you@example.com" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Child's name" name="childName" placeholder="First name" required />
              <Input label="Child's date of birth" name="childDateOfBirth" type="date" required />
            </div>
            <Input label="Preferred start date" name="preferredStart" type="date" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">Programme of interest</label>
              <select
                name="programme"
                className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/5"
              >
                <option>Babies (3-18 months)</option>
                <option>Toddlers (18 months-3 years)</option>
                <option>Pre-primary (3-5 years)</option>
                <option>Aftercare only</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <Textarea
              label="Anything we should know?"
              name="notes"
              placeholder="Allergies, languages spoken at home, settling concerns..."
            />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <p className="text-xs text-muted">
                This creates an application for admin review, not a parent account.
              </p>
              <Button type="submit">Submit application <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </form>
        </Container>
      </Section>
    </PublicShell>
  );
}
