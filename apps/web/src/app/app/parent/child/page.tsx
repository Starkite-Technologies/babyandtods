import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { apiClient, ageFrom, formatDate, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ParentChildPage() {
  const children = await safe(apiClient.children.list(), []);
  const child = children[0];

  if (!child) {
    return (
      <Shell crumbs={["Parent", "Child Profile"]} title="Child Profile">
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-line">
          <p className="text-sm text-muted">No child profile found. Please contact the academy.</p>
        </div>
      </Shell>
    );
  }

  const detail = await safe(apiClient.children.get(child.id), null);
  const attendance = detail?.attendanceRecords ?? [];
  const reports = detail?.dailyReports ?? [];
  const pickups = detail?.authorizedPickups ?? [];
  const allergies = detail?.allergies ?? [];
  const incidents = detail?.incidents ?? [];

  const presentDays = attendance.filter(
    (a) => a.status === "checked-in" || a.status === "picked-up"
  ).length;
  const absentDays = attendance.filter((a) => a.status === "absent").length;
  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentDays / attendance.length) * 100)
      : 0;

  const recentReports = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const recentAttendance = [...attendance]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <Shell crumbs={["Parent", "Child Profile"]} title={child.name}>
      {/* Profile header */}
      <div className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-2xl font-bold text-paper">
            {child.name[0]}
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-ink">{child.name}</h2>
            <p className="text-sm text-muted">
              {ageFrom(child.dateOfBirth)} old
              {child.dateOfBirth && ` · Born ${formatDate(child.dateOfBirth)}`}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="info">{child.classroom?.name ?? "Unassigned"}</Badge>
              {child.classroom?.ageGroup && (
                <Badge tone="neutral">{child.classroom.ageGroup}</Badge>
              )}
              {allergies.length > 0 && (
                <Badge tone="danger">{allergies.length} allergy care plan{allergies.length > 1 ? "s" : ""}</Badge>
              )}
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-ink">{attendanceRate}%</p>
            <p className="text-xs text-muted">attendance rate</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        {/* Main column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Allergies */}
          {allergies.length > 0 && (
            <Card title="Allergy & care plans">
              <div className="space-y-3">
                {allergies.map((a) => (
                  <div
                    key={a.id}
                    className={`rounded-xl border p-4 ${
                      a.severity === "severe"
                        ? "border-red-200 bg-red-50"
                        : a.severity === "moderate"
                        ? "border-amber-200 bg-amber-50"
                        : "border-blue-200 bg-blue-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink">{a.allergen}</p>
                      <Badge
                        tone={
                          a.severity === "severe"
                            ? "danger"
                            : a.severity === "moderate"
                            ? "warning"
                            : "info"
                        }
                      >
                        {a.severity}
                      </Badge>
                    </div>
                    {a.notes && (
                      <p className="mt-1 text-sm text-muted">{a.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent daily reports */}
          <Card title="Daily reports">
            {recentReports.length === 0 ? (
              <p className="text-sm text-muted">No reports yet.</p>
            ) : (
              <div className="space-y-4">
                {recentReports.map((r) => (
                  <div key={r.id} className="rounded-xl border border-line bg-paper p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">{formatDate(r.date)}</p>
                      <Badge
                        tone={
                          r.status === "sent" || r.status === "approved"
                            ? "success"
                            : r.status === "ready"
                            ? "info"
                            : "warning"
                        }
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="font-medium text-muted">Meals</span>
                        <p className="mt-0.5 text-ink">{r.meals}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted">Nap</span>
                        <p className="mt-0.5 text-ink">{r.nap}</p>
                      </div>
                    </div>
                    {r.learningNote && (
                      <div className="mt-3 border-t border-line pt-3">
                        <p className="text-xs font-medium text-muted">Learning note</p>
                        <p className="mt-0.5 text-sm text-ink">{r.learningNote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Incidents */}
          {incidents.length > 0 && (
            <Card title="Incidents">
              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`rounded-xl border p-4 ${
                      inc.severity === "high"
                        ? "border-red-200 bg-red-50"
                        : inc.severity === "medium"
                        ? "border-amber-200 bg-amber-50"
                        : "border-line bg-paper"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-ink">{inc.summary}</p>
                        <p className="mt-1 text-xs text-muted">{formatDate(inc.date)}</p>
                      </div>
                      <Badge
                        tone={
                          inc.severity === "high"
                            ? "danger"
                            : inc.severity === "medium"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {inc.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-6">
          {/* Attendance streak */}
          <Card title="Attendance (recent)">
            <div className="mb-3 flex gap-4">
              <div>
                <p className="text-xl font-bold text-ink">{presentDays}</p>
                <p className="text-xs text-muted">days present</p>
              </div>
              <div>
                <p className="text-xl font-bold text-ink">{absentDays}</p>
                <p className="text-xs text-muted">days absent</p>
              </div>
            </div>
            <div className="flex gap-1 flex-wrap">
              {recentAttendance.map((a) => (
                <div
                  key={a.id}
                  title={`${formatDate(a.date)} · ${a.status}`}
                  className={`h-6 w-6 rounded-md ${
                    a.status === "checked-in" || a.status === "picked-up"
                      ? "bg-emerald-400"
                      : "bg-amber-300"
                  }`}
                />
              ))}
            </div>
            <div className="mt-2 flex gap-3 text-[11px] text-muted">
              <span><span className="mr-1 inline-block h-2 w-2 rounded bg-emerald-400" />Present</span>
              <span><span className="mr-1 inline-block h-2 w-2 rounded bg-amber-300" />Absent</span>
            </div>
          </Card>

          {/* Authorized pickups */}
          <Card title="Authorized pickups">
            {pickups.length === 0 ? (
              <p className="text-sm text-muted">No authorized pickups on file.</p>
            ) : (
              <ul className="space-y-3">
                {pickups.map((p) => (
                  <li key={p.id} className="rounded-xl border border-line bg-paper p-3">
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-muted capitalize">{p.relationship}</p>
                    <p className="mt-1 text-xs text-muted">{p.phone}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}
