import { FileText, MessageCircle } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";
export const metadata = { title: "Documents" };

export default async function ParentDocuments() {
  return (
    <Shell
      crumbs={["Parent", "Documents"]}
      title="Documents"
      action={<Button href="/app/parent/messages" size="sm"><MessageCircle className="h-4 w-4" /> Request document</Button>}
    >
      <section className="rounded-3xl border border-line bg-white p-8 text-center shadow-soft">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-white">
          <FileText className="h-6 w-6" />
        </span>
        <p className="mt-4 text-lg font-semibold text-ink">No live documents yet</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
          The current live database does not expose parent documents yet. When document storage is connected, consent forms,
          statements, and school letters will appear here.
        </p>
        <div className="mt-5">
          <Button href="/app/parent/messages" variant="secondary">Message the office</Button>
        </div>
      </section>
    </Shell>
  );
}
