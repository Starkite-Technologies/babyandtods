import { HeartPulse } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Health Notes" };

export default async function TeacherHealthNotes() {
  const [healthRecords, children] = await Promise.all([
    safe(apiClient.healthRecords.list(), []),
    safe(apiClient.children.list(), [])
  ]);
  const childById = new Map(children.map((child) => [child.id, child]));

  return (
    <Shell crumbs={["Teacher", "Health notes"]} title="Health notes">
      <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700">
            <HeartPulse className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-700">Care note layer</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Important notes, grouped by learner.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Notes are shown as compact care cards instead of a wide table. Open a learner profile for deeper details.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {healthRecords.map((record) => {
          const child = childById.get(record.childId) ?? record.child;
          return (
            <article key={record.id} className="rounded-3xl border border-line bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{child?.name ?? "Learner"}</p>
                  <p className="text-sm text-muted">{child?.classroom?.name ?? "No classroom"}</p>
                </div>
                <Badge tone="warning">care note</Badge>
              </div>
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                {record.notes}
              </p>
              <p className="mt-3 text-xs text-muted">Updated {new Date(record.updatedAt).toLocaleDateString("en-GB")}</p>
            </article>
          );
        })}
        {healthRecords.length === 0 && (
          <Card title="No health notes" description="Live records from the database will appear here." />
        )}
      </div>
    </Shell>
  );
}
