import { AlertTriangle, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Incidents" };

export default async function TeacherIncidents() {
  const [incidents, children] = await Promise.all([
    safe(apiClient.incidents.list(), []),
    safe(apiClient.children.list(), [])
  ]);

  return (
    <Shell
      crumbs={["Teacher", "Incidents"]}
      title="Incidents"
      action={<Button size="sm"><Plus className="h-4 w-4" /> New report</Button>}
    >
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <Card title="New incident report" description="Record the event first. The archive stays below.">
          <form className="space-y-4">
            <Field label="Learner">
              <select className="field">
                <option value="">Select learner</option>
                {children.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
              </select>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Date"><input className="field" type="date" /></Field>
              <Field label="Severity">
                <select className="field">
                  <option>low</option>
                  <option>medium</option>
                  <option>high</option>
                </select>
              </Field>
            </div>
            <Field label="What happened?">
              <textarea className="field min-h-32 py-3" placeholder="Write a clear, factual summary..." />
            </Field>
            <Field label="Action taken">
              <textarea className="field min-h-24 py-3" placeholder="First aid, comfort, parent contact, follow-up..." />
            </Field>
            <Button className="w-full" type="button">Save report</Button>
          </form>
        </Card>

        <section className="space-y-5">
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-700" />
              <div>
                <p className="font-semibold text-amber-900">Incident workflow</p>
                <p className="mt-1 text-sm leading-6 text-amber-800">
                  Complete the report, notify admin, then review records. The record archive intentionally comes last.
                </p>
              </div>
            </div>
          </div>

          <Card title="Incident archive" description="Collapsed record layer. Open only when reviewing history.">
            <details className="rounded-2xl border border-line bg-paper p-4">
              <summary className="cursor-pointer font-semibold text-ink">Open {incidents.length} incident records</summary>
              <div className="mt-4 space-y-3">
                {incidents.map((incident) => (
                  <article key={incident.id} className="rounded-2xl border border-line bg-white p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{incident.child?.name ?? "Learner"}</p>
                        <p className="mt-1 text-sm leading-6 text-muted">{incident.summary}</p>
                      </div>
                      <Badge tone={incident.severity === "high" ? "danger" : incident.severity === "medium" ? "warning" : "neutral"}>{incident.severity}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted">{new Date(incident.date).toLocaleDateString("en-GB")}</p>
                  </article>
                ))}
                {incidents.length === 0 && <p className="text-sm text-muted">No live incident records.</p>}
              </div>
            </details>
          </Card>
        </section>
      </div>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
