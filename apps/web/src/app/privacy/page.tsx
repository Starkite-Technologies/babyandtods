import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Privacy" title="What we collect, and why." description="A plain-language summary of how Babies & Todd's Academy handles family data." />
      <Section>
        <Container size="narrow">
          <article className="prose-content space-y-6 text-ink-700">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">What we collect</h2>
            <p>We collect the minimum information needed to safely care for your child: identity documents, emergency contacts, medical and allergy information, authorized pickup people, and the day-to-day records of care (attendance, meals, naps, notes, photos).</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Who can see it</h2>
            <p>Only academy staff with a need to know. Your child&apos;s daily records are visible only to you, the staff in the room, and the director.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Photos</h2>
            <p>Photos of named, identifiable children are never posted publicly. They are shared only with the family, on the closed parent channel, with consent that you can withdraw at any time.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">How long we keep it</h2>
            <p>Active records are retained while your child is enrolled. After leaving, identifying records are deleted within 12 months, except where the law requires longer retention.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Your rights</h2>
            <p>You can request a copy of your child&apos;s records at any time. You can correct anything that is wrong. You can ask us to delete anything that is not legally required.</p>
            <p className="text-sm text-muted">Last updated 1 June 2026. Questions? Email <a className="link-underline font-medium text-ink" href="mailto:privacy@babiesandtods.com">privacy@babiesandtods.com</a>.</p>
          </article>
        </Container>
      </Section>
    </PublicShell>
  );
}
