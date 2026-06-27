import { Card } from "@/components/Card";
import { PublicPage } from "@/components/PublicPage";

export default function FeesPage() {
  return (
    <PublicPage
      eyebrow="Fees"
      title="Simple monthly fee information"
      summary="A public overview for tuition, registration, meals, aftercare, and payment expectations."
    >
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          {["Registration", "Monthly tuition", "Aftercare"].map((fee) => (
            <div className="rounded-xl bg-cream p-4" key={fee}>
              <p className="font-bold">{fee}</p>
              <p className="mt-2 text-sm text-muted">Contact the academy for current pricing.</p>
            </div>
          ))}
        </div>
      </Card>
    </PublicPage>
  );
}
