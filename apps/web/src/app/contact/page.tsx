import { Card } from "@/components/Card";
import { PublicPage } from "@/components/PublicPage";

export default function ContactPage() {
  return (
    <PublicPage
      eyebrow="Contact"
      title="Visit or contact the academy"
      summary="Public contact details, inquiry forms, and visit scheduling can live here when the academy is ready."
    >
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="font-bold">Location</p>
            <p className="mt-2 text-sm text-muted">Windhoek, Namibia</p>
          </div>
          <div>
            <p className="font-bold">Phone</p>
            <p className="mt-2 text-sm text-muted">Add academy number</p>
          </div>
          <div>
            <p className="font-bold">Email</p>
            <p className="mt-2 text-sm text-muted">Add academy email</p>
          </div>
        </div>
      </Card>
    </PublicPage>
  );
}
