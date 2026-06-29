import { notFound } from "next/navigation";
import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { Timeline } from "@/components/ui/Timeline";
import { apiClient, ageFrom, formatDate, formatTime } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function LearnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let child;
  try {
    child = await apiClient.children.get(id);
  } catch {
    notFound();
  }
  if (!child) notFound();

  return (
    <Shell crumbs={["Admin", "Learners", child.name]} title={child.name}>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card title="Profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date of birth" value={formatDate(child.dateOfBirth)} />
              <Field label="Age" value={ageFrom(child.dateOfBirth)} />
              <Field label="Classroom" value={child.classroom?.name ?? "—"} />
              <Field label="Guardian" value={child.parent?.user?.name ?? "—"} />
            </div>
          </Card>

          <Card title="Allergies & health">
            {child.allergies.length === 0 ? (
              <p className="text-sm text-muted">No allergies on file.</p>
            ) : (
              <DataTable
                columns={["Allergen", "Severity", "Notes"]}
                rows={child.allergies.map((a) => [
                  a.allergen,
                  { kind: "badge" as const, text: a.severity, tone: a.severity === "severe" ? "danger" : a.severity === "moderate" ? "warning" : "neutral" as const },
                  a.notes ?? "—"
                ])}
              />
            )}
          </Card>

          <Card title="Authorized pickup">
            <DataTable
              columns={["Name", "Relationship", "Phone"]}
              rows={child.authorizedPickups.map((p) => [p.name, p.relationship, p.phone])}
              empty="No pickup contacts added."
            />
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Recent attendance">
            <Timeline
              items={child.attendanceRecords.slice(0, 7).map((a) => ({
                time: formatDate(a.date),
                title: a.status,
                detail: a.checkedInAt ? `Checked in ${formatTime(a.checkedInAt)}` : "—"
              }))}
            />
          </Card>
          <Card title="Recent daily reports">
            {child.dailyReports.length === 0 ? (
              <p className="text-sm text-muted">No reports yet.</p>
            ) : (
              <ul className="space-y-3">
                {child.dailyReports.slice(0, 5).map((r) => (
                  <li key={r.id} className="rounded-xl border border-line bg-paper p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">{formatDate(r.date)}</p>
                      <Badge tone={r.status === "approved" || r.status === "sent" ? "success" : "warning"}>{r.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-ink">{r.learningNote}</p>
                    <p className="mt-1 text-xs text-muted">Meals: {r.meals} · Nap: {r.nap}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Incidents log">
            <DataTable
              columns={["Date", "Summary", "Severity"]}
              rows={child.incidents.map((i) => [
                formatDate(i.date),
                i.summary,
                { kind: "badge" as const, text: i.severity, tone: i.severity === "high" ? "danger" : i.severity === "medium" ? "warning" : "neutral" as const }
              ])}
              empty="No incidents on file. 👍"
            />
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</p>
      <p className="mt-1 font-medium text-ink">{value}</p>
    </div>
  );
}
