import { AlertTriangle, MessageCircle } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentParent } from "@/lib/parent";
import { apiClient, formatDate, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Incident Reports" };

export default async function ParentIncidents() {
  const { children } = await getCurrentParent();
  const childIds = new Set(children.map((child) => child.id));
  const incidents = (await safe(apiClient.incidents.list(), []))
    .filter((incident) => childIds.has(incident.childId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Shell crumbs={["Parent", "Incidents"]} title="Incident reports">
      <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Live records</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{incidents.length} incident record{incidents.length === 1 ? "" : "s"}</h2>
            <p className="mt-1 text-sm text-muted">Only records linked to your child profile are shown.</p>
          </div>
          <Button href="/app/parent/messages" size="sm" variant="secondary"><MessageCircle className="h-4 w-4" /> Ask school</Button>
        </div>

        <div className="mt-5 space-y-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-2xl border border-line bg-paper p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{incident.child?.name ?? "Linked learner"}</p>
                  <p className="mt-1 text-sm text-muted">{formatDate(incident.date)}</p>
                </div>
                <Badge tone={incident.severity === "high" ? "danger" : incident.severity === "medium" ? "warning" : "info"}>{incident.severity}</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink">{incident.summary}</p>
            </div>
          ))}
          {incidents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-line p-8 text-center">
              <AlertTriangle className="mx-auto h-8 w-8 text-muted" />
              <p className="mt-3 font-semibold text-ink">No live incident records</p>
              <p className="mt-1 text-sm text-muted">If the school records an incident for your child, it will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </Shell>
  );
}
