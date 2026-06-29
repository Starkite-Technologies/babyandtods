import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

export const metadata = { title: "Safeguarding" };

export default function SafeguardingPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Safeguarding" title="The promises behind every interaction." description="Child protection is not a policy folder. It is how every staff member at Babies & Todd's Academy behaves, every day." />
      <Section>
        <Container size="narrow">
          <article className="space-y-6 text-ink-700">
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Recruitment</h2>
            <p>Every staff member completes a police clearance, two reference checks, and an in-person interview with the director before being offered a role. Qualifications are verified, not assumed.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Training</h2>
            <p>All staff complete annual child protection, paediatric first aid, and fire safety training. Refreshers happen quarterly during planning meetings.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Reporting</h2>
            <p>Any safeguarding concern — internal or external — is escalated immediately to the designated lead. We follow the Namibian Ministry of Gender, Equality, Poverty Eradication and Social Welfare reporting framework.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Visitors</h2>
            <p>No adult is alone with a child unless they are an authorized staff member or named guardian. All visitors sign in, are accompanied, and are visible to other staff at all times.</p>
            <h2 className="font-display text-2xl font-medium tracking-tight text-ink">Designated safeguarding lead</h2>
            <p>Assumpta SM Gahutu, Founder &amp; Director. Reachable at <a className="link-underline font-medium text-ink" href="mailto:safeguarding@babiesandtods.com">safeguarding@babiesandtods.com</a>.</p>
            <p className="text-sm text-muted">Last updated 1 June 2026.</p>
          </article>
        </Container>
      </Section>
    </PublicShell>
  );
}
