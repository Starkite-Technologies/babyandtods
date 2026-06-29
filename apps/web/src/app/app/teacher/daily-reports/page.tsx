import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { ToastStack } from "@/components/ui/Toast";
import { ReportComposer } from "@/components/features/ReportComposer";
import { apiClient, formatDate, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DailyReportsPage() {
  const [reports, children] = await Promise.all([
    safe(apiClient.dailyReports.recent(), []),
    safe(apiClient.children.list(), [])
  ]);

  const sent = reports.filter((r) => r.status === "sent" || r.status === "approved").length;
  const pending = reports.filter((r) => r.status === "draft" || r.status === "ready").length;
  const today = new Date().toISOString().split("T")[0];
  const doneToday = new Set(reports.filter((r) => r.date?.split("T")[0] === today).map((r) => r.childId)).size;

  const recent = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <Shell crumbs={["Teacher", "Daily reports"]} title="Daily reports">
      <ToastStack />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent today" value={doneToday} detail={`${children.length} learners`} tone="success" />
        <StatCard label="Pending" value={pending} detail="Drafts & ready" tone={pending > 0 ? "warning" : "success"} />
        <StatCard label="Sent all-time" value={sent} detail="Reports delivered" />
      </div>

      <ReportComposer children={children.map((c) => ({ id: c.id, name: c.name }))} />

      <div className="mt-6">
        <Card title="Recently sent">
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">No reports yet — compose one above.</p>
          ) : (
            <div className="divide-y divide-line/60">
              {recent.map((r) => (
                <div key={r.id} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{r.child?.name ?? "—"}</p>
                    <p className="truncate text-xs text-muted">{r.learningNote}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatDate(r.date)}</p>
                  </div>
                  <Badge tone={r.status === "sent" || r.status === "approved" ? "success" : r.status === "ready" ? "info" : "warning"}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}
