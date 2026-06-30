import { ClipboardList, Sparkles } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ToastStack } from "@/components/ui/Toast";
import { ReportComposer } from "@/components/features/ReportComposer";
import { apiClient, formatDate, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daily Reports" };

export default async function DailyReportsPage() {
  const [reports, children] = await Promise.all([
    safe(apiClient.dailyReports.recent(), []),
    safe(apiClient.children.list(), [])
  ]);

  const today = new Date().toISOString().split("T")[0];
  const completedToday = new Set(reports.filter((report) => report.date?.split("T")[0] === today).map((report) => report.childId));
  const queue = children.filter((child) => !completedToday.has(child.id));
  const recent = [...reports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <Shell crumbs={["Teacher", "Daily reports"]} title="Daily reports">
      <ToastStack />

      <section className="mb-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">Parent-ready updates</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Draft once, review, then send.</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              The report composer stays focused. History and unfinished learners are layered beside it, not mixed into one long page.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <Meter label="Done today" value={completedToday.size} />
            <Meter label="Still needed" value={queue.length} warn={queue.length > 0} />
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <ReportComposer children={children.map((child) => ({ id: child.id, name: child.name }))} />

        <aside className="space-y-5">
          <Card title="Report queue" description="Learners without a report today.">
            <div className="space-y-2">
              {queue.slice(0, 8).map((child) => (
                <div key={child.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-3 py-2">
                  <span className="truncate text-sm font-medium text-ink">{child.name}</span>
                  <Badge tone="warning">needed</Badge>
                </div>
              ))}
              {queue.length === 0 && <p className="text-sm text-muted">All learners have reports for today.</p>}
            </div>
          </Card>

          <Card title="Recent reports" description="Latest sent or drafted reports.">
            <div className="space-y-3">
              {recent.map((report) => (
                <details key={report.id} className="rounded-2xl border border-line bg-paper p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-ink">
                    {report.child?.name ?? "Learner"} · {formatDate(report.date)}
                  </summary>
                  <p className="mt-2 text-sm leading-6 text-muted">{report.learningNote}</p>
                  <Badge className="mt-3" tone={report.status === "sent" || report.status === "approved" ? "success" : report.status === "ready" ? "info" : "warning"}>
                    {report.status}
                  </Badge>
                </details>
              ))}
              {recent.length === 0 && <p className="text-sm text-muted">No reports yet.</p>}
            </div>
          </Card>
        </aside>
      </div>
    </Shell>
  );
}

function Meter({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-paper px-4 py-3">
      <p className={`text-2xl font-semibold ${warn ? "text-amber-700" : "text-ink"}`}>{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
      {warn ? <Sparkles className="mx-auto mt-1 h-3.5 w-3.5 text-amber-600" /> : <ClipboardList className="mx-auto mt-1 h-3.5 w-3.5 text-muted" />}
    </div>
  );
}
