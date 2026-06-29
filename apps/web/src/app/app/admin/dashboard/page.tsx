import { ArrowRight, Bot, CreditCard, QrCode, Radio } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { apiClient, formatMoney, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

const workflowActions = [
  {
    title: "Open QR check-in lane",
    detail: "Front desk can scan arrivals and pickup passes.",
    icon: QrCode
  },
  {
    title: "Review AI daily-report drafts",
    detail: "Teacher notes become parent-ready summaries.",
    icon: Bot
  },
  {
    title: "Send parent payment links",
    detail: "Create a clean payment batch for pending fees.",
    icon: CreditCard
  },
  {
    title: "Broadcast pickup reminder",
    detail: "Send one message to selected classrooms or all parents.",
    icon: Radio
  }
];

export default async function AdminDashboard() {
  const [children, attendance, invoiceSum, classrooms] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.invoices.summary(), { total: 0, paid: 0, pending: 0, overdue: 0, count: 0 }),
    safe(apiClient.classrooms.list(), [])
  ]);

  const checkedIn = attendance.filter((item) => item.status === "checked-in").length;
  const attendanceRate = attendance.length ? Math.round((checkedIn / attendance.length) * 100) : 0;
  const collectionRate = invoiceSum.total ? Math.round((invoiceSum.paid / invoiceSum.total) * 100) : 0;
  const outstanding = invoiceSum.pending + invoiceSum.overdue;
  const maxRoom = Math.max(...classrooms.map((room) => room.children?.length ?? 0), 1);

  return (
    <Shell
      crumbs={["Admin", "Dashboard"]}
      title="Academy control room"
      action={
        <Button href="/app/admin/operations" size="sm">
          Live operations
          <ArrowRight className="h-4 w-4" />
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Learners" value={children.length} detail={`${classrooms.length} active rooms`} />
        <StatCard
          label="Checked in"
          value={`${checkedIn} / ${attendance.length}`}
          detail={`${attendanceRate}% live attendance`}
          tone={attendanceRate >= 80 ? "success" : "warning"}
        />
        <StatCard
          label="Collection rate"
          value={`${collectionRate}%`}
          detail={outstanding > 0 ? `${formatMoney(outstanding)} outstanding` : "All clear"}
          tone={outstanding > 0 ? "warning" : "success"}
        />
        <StatCard label="Smart actions" value={workflowActions.length} detail="Ready to run" tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
        <Card
          title="Live attendance board"
          description="Fast check-in visibility without opening record-heavy pages."
          className="border-white/70 bg-white/75 shadow-lift backdrop-blur-xl"
        >
          <DataTable
            columns={["Learner", "Classroom", "Status", "Check-in", "Action"]}
            rows={attendance.map((item) => [
              item.child?.name ?? "Learner",
              item.child?.classroom?.name ?? "Room pending",
              {
                kind: "badge" as const,
                text: item.status,
                tone: item.status === "checked-in" ? "success" : item.status === "absent" ? "warning" : "neutral"
              },
              item.checkedInAt ? formatTime(item.checkedInAt) : "Not scanned",
              {
                kind: "raw" as const,
                node: (
                  <Button href="/app/admin/operations" size="sm" variant="secondary">
                    Open pass
                  </Button>
                )
              }
            ])}
            empty="No attendance recorded yet today."
          />
        </Card>

        <div className="flex flex-col gap-6">
          <Card
            title="Run next"
            description="Interactive workflow shortcuts."
            className="border-white/70 bg-white/75 shadow-lift backdrop-blur-xl"
          >
            <ul className="space-y-3">
              {workflowActions.map((action) => {
                const Icon = action.icon;
                return (
                  <li key={action.title} className="rounded-2xl border border-line bg-paper/75 p-4">
                    <div className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-paper">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">{action.title}</p>
                        <p className="mt-1 text-xs leading-5 text-muted">{action.detail}</p>
                      </div>
                    </div>
                    <Button href="/app/admin/operations" className="mt-3 w-full" size="sm" variant="outline">
                      Launch
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Room capacity" className="border-white/70 bg-white/75 backdrop-blur-xl">
            {classrooms.length === 0 ? (
              <p className="text-sm text-muted">No classrooms set up.</p>
            ) : (
              <ul className="space-y-3.5">
                {classrooms.map((room) => {
                  const enrolled = room.children?.length ?? 0;
                  return (
                    <li key={room.id}>
                      <div className="mb-1.5 flex items-baseline justify-between">
                        <span className="text-sm font-medium text-ink">{room.name}</span>
                        <span className="font-mono text-xs text-muted">{enrolled} learners</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-ink-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-sage to-sky" style={{ width: `${(enrolled / maxRoom) * 100}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </Shell>
  );
}
