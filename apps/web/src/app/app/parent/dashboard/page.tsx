import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { apiClient, ageFrom, formatDate, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ParentDashboard() {
  const [children, announcements] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.announcements.list("parents"), [])
  ]);

  const child = children[0];

  const [attendance, reports, allergies, invoices] = child
    ? await Promise.all([
        safe(apiClient.attendance.forChild(child.id), []),
        safe(apiClient.dailyReports.forChild(child.id), []),
        safe(apiClient.allergies.list(), []),
        safe(apiClient.invoices.forParent(child.parentId ?? ""), [])
      ])
    : [[], [], [], []];

  const today = new Date().toISOString().split("T")[0];
  const todayAtt = attendance.find((a) => a.date?.split("T")[0] === today);
  const childAllergies = allergies.filter((a) => a.childId === child?.id);
  const latestReport = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const unpaid = invoices.filter((i) => i.status !== "paid");
  const presentDays = attendance.filter((a) => a.status === "checked-in" || a.status === "picked-up").length;
  const latestNotice = [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  if (!child) {
    return (
      <Shell crumbs={["Parent", "Dashboard"]} title="Dashboard">
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-line">
          <p className="text-sm text-muted">No child profile found. Please contact the academy.</p>
        </div>
      </Shell>
    );
  }

  const todayStatus = todayAtt
    ? todayAtt.status === "checked-in"
      ? "Present"
      : todayAtt.status === "absent"
      ? "Absent"
      : "Picked up"
    : "Not in yet";

  return (
    <Shell crumbs={["Parent", "Dashboard"]} title={`Good day, ${child.parent?.user?.name?.split(" ")[0] ?? "there"}`}>
      {/* Child banner */}
      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-surface p-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-2xl text-paper">
          {child.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-medium tracking-tight text-ink">{child.name}</h2>
          <p className="text-sm text-muted">
            {ageFrom(child.dateOfBirth)} · {child.classroom?.name ?? "Unassigned"}
          </p>
        </div>
        <div className="text-right">
          <Badge
            tone={
              todayAtt?.status === "checked-in" ? "success" : todayAtt?.status === "absent" ? "warning" : "neutral"
            }
          >
            {todayStatus}
          </Badge>
          {todayAtt?.checkedInAt && <p className="mt-1.5 text-xs text-muted">Arrived {formatTime(todayAtt.checkedInAt)}</p>}
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard label="Days present" value={presentDays} detail="This period" tone="success" />
        <StatCard label="Daily reports" value={reports.length} detail={latestReport ? `Last ${formatDate(latestReport.date)}` : "None yet"} />
        <StatCard
          label="Outstanding bills"
          value={unpaid.length}
          detail={unpaid.length === 0 ? "All settled" : "Awaiting payment"}
          tone={unpaid.length > 0 ? "warning" : "success"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Latest report — the thing parents actually open for */}
        <Card title="Latest daily report" description={latestReport ? formatDate(latestReport.date) : undefined}>
          {!latestReport ? (
            <p className="py-8 text-center text-sm text-muted">No reports shared yet.</p>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-paper p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">Meals</p>
                  <p className="mt-1 text-sm font-medium text-ink">{latestReport.meals}</p>
                </div>
                <div className="rounded-xl bg-paper p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">Nap</p>
                  <p className="mt-1 text-sm font-medium text-ink">{latestReport.nap}</p>
                </div>
              </div>
              {latestReport.learningNote && (
                <div className="rounded-xl bg-paper p-4">
                  <p className="text-xs uppercase tracking-wider text-muted">Learning note</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{latestReport.learningNote}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          {childAllergies.length > 0 && (
            <Card title="Care plan">
              <ul className="space-y-2">
                {childAllergies.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2">
                    <span className="text-sm text-ink">{a.allergen}</span>
                    <Badge tone={a.severity === "severe" ? "danger" : a.severity === "moderate" ? "warning" : "info"}>
                      {a.severity}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card title="From the academy">
            {!latestNotice ? (
              <p className="text-sm text-muted">No notices right now.</p>
            ) : (
              <div>
                <p className="text-sm font-medium text-ink">{latestNotice.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{latestNotice.body}</p>
                <p className="mt-2 text-xs text-muted">{formatDate(latestNotice.createdAt)}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}
