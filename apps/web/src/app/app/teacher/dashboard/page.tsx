import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { apiClient, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

const schedule = [
  { time: "08:30", title: "Morning meeting" },
  { time: "09:30", title: "Story circle" },
  { time: "10:45", title: "Outdoor play" },
  { time: "12:15", title: "Lunch" },
  { time: "14:00", title: "Rest time" },
  { time: "15:30", title: "Afternoon activities" }
];

export default async function TeacherDashboard() {
  const [attendance, reports, allergies] = await Promise.all([
    safe(apiClient.attendance.today(), []),
    safe(apiClient.dailyReports.recent(), []),
    safe(apiClient.allergies.list(), [])
  ]);

  const checkedIn = attendance.filter((a) => a.status === "checked-in").length;
  const draftReports = reports.filter((r) => r.status === "draft" || r.status === "ready").length;
  const severe = allergies.filter((a) => a.severity === "severe");

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  const nextSession = schedule.find((s) => {
    const [h, m] = s.time.split(":").map(Number);
    return h + m / 60 > currentHour;
  });

  return (
    <Shell crumbs={["Teacher", "Classroom"]} title="Sunshine class · today">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Present" value={`${checkedIn} / ${attendance.length}`} detail="Checked in" tone={checkedIn === attendance.length && attendance.length > 0 ? "success" : "warning"} />
        <StatCard label="Reports pending" value={draftReports} detail="Drafts & ready" tone={draftReports > 0 ? "warning" : "success"} />
        <StatCard label="Care alerts" value={severe.length} detail="Severe allergies" tone={severe.length > 0 ? "danger" : "success"} />
        <StatCard label="Next up" value={nextSession?.time ?? "—"} detail={nextSession?.title ?? "Day complete"} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title="Today's roll" description="Tap a learner in Attendance to update">
          {attendance.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No attendance recorded yet.</p>
          ) : (
            <div className="divide-y divide-line">
              {attendance.map((a) => {
                const alert = allergies.find((al) => al.childId === a.childId && al.severity === "severe");
                return (
                  <div key={a.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-display text-xs text-paper">
                      {(a.child?.name ?? "?")[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{a.child?.name ?? "—"}</p>
                      {a.checkedInAt && <p className="text-xs text-muted">In at {formatTime(a.checkedInAt)}</p>}
                    </div>
                    {alert && <Badge tone="danger">{alert.allergen}</Badge>}
                    <Badge tone={a.status === "checked-in" ? "success" : a.status === "absent" ? "warning" : "neutral"}>
                      {a.status === "checked-in" ? "Present" : a.status === "absent" ? "Absent" : "Picked up"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          {severe.length > 0 && (
            <Card title="Care alerts">
              <ul className="space-y-3">
                {severe.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                    <div>
                      <p className="text-sm font-medium text-ink">{a.child?.name ?? "—"}</p>
                      <p className="text-xs text-muted">{a.allergen}{a.notes ? ` · ${a.notes}` : ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="Today's flow">
            <ol className="space-y-0">
              {schedule.map((s, i) => {
                const [h, m] = s.time.split(":").map(Number);
                const itemHour = h + m / 60;
                const past = itemHour < currentHour;
                const isNext = s === nextSession;
                return (
                  <li key={i} className={`flex items-center gap-3 border-b border-line py-2.5 last:border-0 last:pb-0 ${past ? "opacity-45" : ""}`}>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isNext ? "bg-accent text-white" : past ? "bg-ink-100 text-ink-400" : "bg-ink-50 text-ink-500"
                      }`}
                    >
                      {past ? "✓" : isNext ? "▶" : "·"}
                    </span>
                    <span className="font-mono text-xs text-muted">{s.time}</span>
                    <span className="text-sm font-medium text-ink">{s.title}</span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
