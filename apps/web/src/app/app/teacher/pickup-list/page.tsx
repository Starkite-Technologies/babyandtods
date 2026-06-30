import { ShieldCheck } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pickup List" };

export default async function TeacherPickupList() {
  const [children, attendance] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), [])
  ]);
  const attendanceByChild = new Map(attendance.map((item) => [item.childId, item]));
  const onPremises = children.filter((child) => {
    const record = attendanceByChild.get(child.id);
    return record?.status === "checked-in";
  });
  const pickedUp = attendance.filter((item) => item.status === "picked-up").length;

  return (
    <Shell crumbs={["Teacher", "Pickup"]} title="Pickup list">
      <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Pickup verification</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Verify the child first, then release.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              This view uses live attendance records. Detailed pickup permissions belong inside the learner profile layer.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card title="Learners still on premises" description="Only children currently checked in appear here.">
          <div className="grid gap-3 md:grid-cols-2">
            {onPremises.map((child) => (
              <article key={child.id} className="rounded-2xl border border-line bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{child.name}</p>
                    <p className="text-sm text-muted">{child.parent?.user?.name ?? "No parent linked"}</p>
                  </div>
                  <Badge tone="success">on premises</Badge>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm">Confirm pickup</Button>
                  <Button size="sm" variant="secondary" href={`/app/teacher/learners?learner=${child.id}`}>Profile</Button>
                </div>
              </article>
            ))}
            {onPremises.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">No learners are currently marked on premises.</p>}
          </div>
        </Card>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-line bg-ink p-5 text-white shadow-soft">
            <p className="text-3xl font-semibold">{pickedUp}</p>
            <p className="mt-1 text-sm text-white/70">already picked up today</p>
          </div>
          <Card title="Verification steps">
            <ol className="space-y-3 text-sm text-muted">
              <li className="rounded-2xl border border-line bg-white p-3">1. Match learner to parent or authorised contact.</li>
              <li className="rounded-2xl border border-line bg-white p-3">2. Confirm ID or known collection code.</li>
              <li className="rounded-2xl border border-line bg-white p-3">3. Mark pickup only after handover.</li>
            </ol>
          </Card>
        </aside>
      </div>
    </Shell>
  );
}
