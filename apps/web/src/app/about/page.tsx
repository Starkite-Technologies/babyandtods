import { Card } from "@/components/Card";
import { PublicPage } from "@/components/PublicPage";

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About us"
      title="A caring academy built around trust"
      summary="Babies & Todd's Academy combines attentive care, classroom structure, and clear family communication for children from infancy to school readiness."
    >
      <Card>
        <p className="text-base leading-8 text-muted">
          The academy prioritizes safety, belonging, language, movement, creativity, and independence. The platform mirrors that work with organized records for parents, teachers, and administrators.
        </p>
      </Card>
    </PublicPage>
  );
}
