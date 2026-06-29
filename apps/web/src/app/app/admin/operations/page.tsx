import { Activity, BellRing, Bot, CreditCard, QrCode, Radio, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import { StatCard } from "@/components/ui/StatCard";
import { apiClient, formatMoney, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

const smartQueue = [
  {
    title: "Create missing daily reports",
    detail: "AI can draft parent-ready summaries from attendance and teacher notes.",
    status: "Ready"
  },
  {
    title: "Send payment nudges",
    detail: "3 pending invoices can receive polite reminders with payment links.",
    status: "Review"
  },
  {
    title: "Confirm afternoon pickup lane",
    detail: "Generate QR passes for verified pickup contacts.",
    status: "Live"
  }
];

const broadcastTemplates = [
  "Pickup lane opens at 15:15.",
  "Please bring sun hats tomorrow.",
  "Invoices are ready in the parent portal."
];

export default async function LiveOperationsPage() {
  const [children, attendance, invoices] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.invoices.summary(), { total: 0, paid: 0, pending: 0, overdue: 0, count: 0 })
  ]);

  const checkedIn = attendance.filter((item) => item.status === "checked-in").length;
  const pendingPickup = Math.max(checkedIn - attendance.filter((item) => item.checkedOutAt).length, 0);
  const automationScore = children.length ? Math.min(96, 72 + children.length * 3) : 72;
  const paymentTasks = Number(invoices.pending > 0) + Number(invoices.overdue > 0);

  return (
    <Shell
      crumbs={["Admin", "Live Operations"]}
      title="Live operations command center"
      action={
        <Button size="sm">
          <Radio className="h-4 w-4" />
          Broadcast
        </Button>
      }
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(241,222,184,0.38),rgba(110,148,176,0.28))] p-5 shadow-lift backdrop-blur-xl sm:p-6">
        <div className="absolute right-6 top-6 hidden h-28 w-28 rounded-full border border-white/80 bg-white/40 blur-sm lg:block" />
        <div className="relative grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Badge tone="info">
              <Sparkles className="h-3.5 w-3.5" />
              Glass mode active
            </Badge>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold text-ink sm:text-4xl">
              Run the school day from one live screen.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Check learners in, trigger parent alerts, prepare payment links, and create AI-assisted daily reports without opening old record-keeping pages.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm">
                <QrCode className="h-4 w-4" />
                Open QR lane
              </Button>
              <Button size="sm" variant="secondary">
                <Bot className="h-4 w-4" />
                Draft reports
              </Button>
              <Button size="sm" variant="outline">
                <CreditCard className="h-4 w-4" />
                Payment run
              </Button>
            </div>
          </div>
          <div className="rounded-3xl border border-white/80 bg-ink p-5 text-paper shadow-lift">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-paper/60">Automation pulse</span>
              <Activity className="h-4 w-4 text-sunset" />
            </div>
            <p className="mt-4 text-5xl font-semibold">{automationScore}%</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-gradient-to-r from-sunset via-coral to-sky" style={{ width: `${automationScore}%` }} />
            </div>
            <p className="mt-4 text-sm text-paper/70">Live workflows ready for admin review.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Checked in" value={checkedIn} detail={`${attendance.length} attendance records`} tone="success" />
        <StatCard label="Pickup queue" value={pendingPickup} detail="Waiting for afternoon handover" tone={pendingPickup > 0 ? "accent" : "success"} />
        <StatCard label="Payment tasks" value={paymentTasks} detail={`${formatMoney(invoices.pending + invoices.overdue)} to collect`} tone={invoices.overdue > 0 ? "warning" : "accent"} />
        <StatCard label="AI drafts" value={smartQueue.length} detail="Ready for review" tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card
          title="Live check-in and pickup lane"
          description="A fast operational board for the front desk."
          className="border-white/70 bg-white/75 shadow-lift backdrop-blur-xl"
          action={<Badge tone="success">Live</Badge>}
        >
          <DataTable
            columns={["Learner", "Room", "Status", "Last scan", "Action"]}
            rows={attendance.slice(0, 7).map((item) => [
              item.child?.name ?? "Learner",
              item.child?.classroom?.name ?? "Room pending",
              { kind: "badge", text: item.status, tone: item.status === "checked-in" ? "success" : "warning" },
              item.checkedInAt ? formatTime(item.checkedInAt) : "Not scanned",
              {
                kind: "raw",
                node: (
                  <Button size="sm" variant="secondary">
                    <QrCode className="h-3.5 w-3.5" />
                    Pass
                  </Button>
                )
              }
            ])}
            empty="No live attendance yet."
          />
        </Card>

        <Card
          title="Smart action queue"
          description="Admin approves the action before anything is sent."
          className="border-white/70 bg-white/75 shadow-lift backdrop-blur-xl"
        >
          <div className="space-y-3">
            {smartQueue.map((item) => (
              <div key={item.title} className="rounded-2xl border border-line/70 bg-paper/75 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
                  </div>
                  <Badge tone={item.status === "Live" ? "success" : item.status === "Review" ? "warning" : "info"}>
                    {item.status}
                  </Badge>
                </div>
                <Button className="mt-3 w-full" size="sm" variant="outline">
                  Review action
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Parent alerts" description="Quick two-way messages." className="border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="space-y-2">
            {broadcastTemplates.map((template) => (
              <button
                key={template}
                className="flex w-full items-center justify-between rounded-2xl border border-line bg-paper/80 px-4 py-3 text-left text-sm text-ink transition hover:border-ink/30 hover:bg-white"
              >
                <span>{template}</span>
                <Send className="h-4 w-4 text-muted" />
              </button>
            ))}
          </div>
        </Card>

        <Card title="Payments portal" description="Collect fees without a paper chase." className="border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="rounded-2xl bg-ink p-4 text-paper">
            <p className="text-xs uppercase text-paper/60">Outstanding</p>
            <p className="mt-2 text-3xl font-semibold">{formatMoney(invoices.pending + invoices.overdue)}</p>
            <p className="mt-2 text-xs text-paper/60">Generate payment links for pending accounts.</p>
          </div>
          <Button className="mt-4 w-full" variant="secondary">
            <CreditCard className="h-4 w-4" />
            Create payment batch
          </Button>
        </Card>

        <Card title="Secure approvals" description="Human review stays in control." className="border-white/70 bg-white/75 backdrop-blur-xl">
          <div className="space-y-3 text-sm text-ink">
            <div className="flex items-center gap-3 rounded-2xl bg-paper/80 p-3">
              <ShieldCheck className="h-5 w-5 text-sage" />
              Pickup permission changes require admin approval.
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-paper/80 p-3">
              <BellRing className="h-5 w-5 text-sunset" />
              Parent alerts can be sent to one child, one room, or all parents.
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-paper/80 p-3">
              <Bot className="h-5 w-5 text-sky" />
              AI drafts never send until a staff member approves.
            </div>
          </div>
        </Card>
      </div>
    </Shell>
  );
}
