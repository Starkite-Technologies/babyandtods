import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const groups: Array<{ topic: string; items: { q: string; a: string }[] }> = [
  {
    topic: "Admissions & enrolment",
    items: [
      { q: "How do I apply?", a: "Submit the short online form on the admissions page. We respond within one working day with next steps and tour times." },
      { q: "Is there a waiting list?", a: "Yes, for some classrooms. We&apos;ll tell you honestly whether a space is likely this term or next." },
      { q: "When can my child start?", a: "Any month of the year, subject to space. We agree a settling-in plan with the lead teacher beforehand." },
      { q: "Do siblings get priority?", a: "Yes — current families are always considered first, and you receive a 10 % sibling discount from the second child." }
    ]
  },
  {
    topic: "Day-to-day care",
    items: [
      { q: "What are your hours?", a: "Most programmes run 07:00–17:30, Monday to Friday. Aftercare runs from 14:00." },
      { q: "Do you provide meals?", a: "Yes — breakfast, lunch, and an afternoon snack are included. Menus rotate monthly and follow allergy plans." },
      { q: "What about nappies and wipes?", a: "Included in our babies and toddlers programmes. You don&apos;t need to send any." },
      { q: "How do you handle sick children?", a: "We call you within ten minutes, share temperature and symptoms, and follow your agreed care plan. Children with infectious illness stay home." }
    ]
  },
  {
    topic: "Safety & safeguarding",
    items: [
      { q: "Who can pick up my child?", a: "Only people you have explicitly authorized, with photo verification and ID check at every pickup." },
      { q: "Are staff vetted?", a: "Every staff member has a police clearance, qualifications check, two reference checks, and ongoing child-protection training." },
      { q: "What is your accident policy?", a: "Any incident is logged the same day. You see the report on your phone before pickup, with a photo if relevant, and a phone call for anything more than a graze." }
    ]
  },
  {
    topic: "Platform & communication",
    items: [
      { q: "How do I see what happened today?", a: "Open the parent app — check-in time, meals, naps, mood, photos, and notes are all visible the moment they happen." },
      { q: "Can I message my child&apos;s teacher?", a: "Yes, directly through the app. Teachers reply during planning breaks and at end of day." },
      { q: "Do you post my child&apos;s photos publicly?", a: "Never. Photos are shared only with the family, on the closed parent channel, with revocable consent." }
    ]
  }
];

export const metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="FAQ"
        title="Everything families usually ask, answered clearly."
        description="If your question isn&apos;t here, ask us directly — we reply within one working day."
        actions={<Button href="/contact" variant="secondary">Ask a question <ArrowRight className="h-4 w-4" /></Button>}
      />
      <Section>
        <Container size="narrow">
          {groups.map((group, gi) => (
            <div key={group.topic} className={gi > 0 ? "mt-16" : ""}>
              <SectionHeader title={group.topic} />
              <div className="mt-8 divide-y divide-line border-y border-line">
                {group.items.map((f) => (
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
            </div>
          ))}
        </Container>
      </Section>
    </PublicShell>
  );
}
