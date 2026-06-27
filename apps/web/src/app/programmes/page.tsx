import { Card } from "@/components/Card";
import { PublicPage } from "@/components/PublicPage";

export default function ProgrammesPage() {
  const programmes = ["Babies", "Toddlers", "Pre-primary", "Aftercare"];

  return (
    <PublicPage
      eyebrow="Programmes"
      title="Purposeful learning for every stage"
      summary="Programmes are designed around gentle transitions, play-based discovery, social confidence, and practical school readiness."
    >
      <div className="grid gap-5 md:grid-cols-4">
        {programmes.map((programme) => (
          <Card key={programme}>
            <h2 className="font-bold">{programme}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Mock programme overview ready for detailed curriculum content.</p>
          </Card>
        ))}
      </div>
    </PublicPage>
  );
}
