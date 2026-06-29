import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Terms" title="The agreement between us." description="A clear summary of the terms families agree to when enrolling at Babies & Todd's Academy." />
      <Section>
        <Container size="narrow">
          <article className="space-y-6 text-ink-700">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Enrolment</h2>
            <p>A place is confirmed once the registration fee is paid and the enrolment form is signed. Places are held only when confirmed.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Fees</h2>
            <p>Fees are billed monthly in advance, due by the 1st of each month. Late payment of more than 14 days will, after written notice, result in suspension of the place.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Notice</h2>
            <p>One calendar month written notice is required before withdrawing a child. Fees in lieu of notice apply where shorter notice is given.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Health & safety</h2>
            <p>Children with infectious illness must remain at home for the period specified by the academy&apos;s health policy. Parents must keep emergency contacts and medical information up to date.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Behavioural & safeguarding</h2>
            <p>The academy reserves the right to refuse enrolment or require withdrawal in cases of repeated breach of policy, behaviour that endangers other children or staff, or non-payment.</p>
            <p className="text-sm text-muted">Last updated 1 June 2026.</p>
          </article>
        </Container>
      </Section>
    </PublicShell>
  );
}
