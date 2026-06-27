import { Card } from "@/components/Card";
import { PublicPage } from "@/components/PublicPage";

export default function AdmissionsPage() {
  return (
    <PublicPage
      eyebrow="Admissions"
      title="A clear path from inquiry to first day"
      summary="Families can learn about availability, required documents, orientation, and the first-week settling plan."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {["Tour", "Application", "Orientation"].map((step, index) => (
          <Card key={step}>
            <p className="text-xs font-bold uppercase tracking-widest text-terracotta">Step {index + 1}</p>
            <h2 className="mt-2 text-lg font-bold">{step}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Admissions content is mocked for now and ready for academy-specific copy.</p>
          </Card>
        ))}
      </div>
    </PublicPage>
  );
}
