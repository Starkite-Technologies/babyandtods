import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable } from "@/components/ui/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient, formatDate, formatMoney, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminFinancePage() {
  const [invoices, payments, parents] = await Promise.all([
    safe(apiClient.invoices.list(), []),
    safe(apiClient.payments.list(), []),
    safe(apiClient.parents.list(), [])
  ]);

  const totalRevenue = invoices.reduce((s, i) => s + Number(i.amount), 0);
  const collected = invoices
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.amount), 0);
  const pendingAmt = invoices
    .filter((i) => i.status === "pending")
    .reduce((s, i) => s + Number(i.amount), 0);
  const overdueAmt = invoices
    .filter((i) => i.status === "overdue")
    .reduce((s, i) => s + Number(i.amount), 0);
  const collectionRate = totalRevenue > 0 ? Math.round((collected / totalRevenue) * 100) : 0;

  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .slice(0, 8);

  // By parent — outstanding
  const parentBalances = parents
    .map((p) => {
      const owing = invoices
        .filter((i) => i.parentId === p.id && i.status !== "paid")
        .reduce((s, i) => s + Number(i.amount), 0);
      return { name: p.user.name, owing, count: invoices.filter((i) => i.parentId === p.id && i.status !== "paid").length };
    })
    .filter((p) => p.owing > 0)
    .sort((a, b) => b.owing - a.owing);

  return (
    <Shell
      crumbs={["Admin", "Finance"]}
      title="Finance"
      action={<Button size="sm">+ New invoice</Button>}
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total billed" value={formatMoney(totalRevenue)} detail={`${invoices.length} invoices`} />
        <StatCard
          label="Collected"
          value={formatMoney(collected)}
          detail={`${collectionRate}% collection rate`}
          tone="success"
        />
        <StatCard
          label="Outstanding"
          value={formatMoney(pendingAmt)}
          detail={`${invoices.filter((i) => i.status === "pending").length} invoices pending`}
          tone="warning"
        />
        <StatCard
          label="Overdue"
          value={formatMoney(overdueAmt)}
          detail={`${invoices.filter((i) => i.status === "overdue").length} overdue`}
          tone={overdueAmt > 0 ? "danger" : "success"}
        />
      </div>

      {/* Collection rate bar */}
      <div className="mt-4 rounded-2xl border border-line bg-surface p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Collection rate</p>
          <span className="text-sm font-bold tabular-nums text-ink">{collectionRate}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-ink-50">
          <div
            className={`h-full rounded-full transition-all ${
              collectionRate >= 80
                ? "bg-emerald-500"
                : collectionRate >= 60
                ? "bg-amber-400"
                : "bg-red-400"
            }`}
            style={{ width: `${collectionRate}%` }}
          />
        </div>
        <div className="mt-3 flex gap-6 text-xs text-muted">
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Collected {formatMoney(collected)}
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />
            Pending {formatMoney(pendingAmt)}
          </span>
          {overdueAmt > 0 && (
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-400" />
              Overdue {formatMoney(overdueAmt)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Invoice list */}
        <Card title="All invoices">
          <DataTable
            columns={["Parent", "Amount", "Due date", "Status"]}
            rows={invoices.map((inv) => [
              inv.parent?.user?.name ?? "—",
              formatMoney(inv.amount),
              formatDate(inv.dueDate),
              {
                kind: "badge" as const,
                text: inv.status,
                tone:
                  inv.status === "paid"
                    ? "success"
                    : inv.status === "overdue"
                    ? "danger"
                    : "warning"
              }
            ])}
            empty="No invoices found."
          />
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Outstanding balances */}
          <Card title="Outstanding balances">
            {parentBalances.length === 0 ? (
              <p className="text-sm text-muted">All accounts are clear.</p>
            ) : (
              <ul className="space-y-2">
                {parentBalances.map((p) => (
                  <li
                    key={p.name}
                    className="flex items-center justify-between rounded-xl border border-line bg-paper p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-muted">{p.count} unpaid</p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-red-600">
                      {formatMoney(p.owing)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Recent payments */}
          <Card title="Recent payments">
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted">No payments yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between border-b border-line pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {p.invoice?.parent?.user?.name ?? "—"}
                      </p>
                      <p className="text-[11px] text-muted">
                        {p.method} · {formatDate(p.paidAt)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-emerald-600">
                      +{formatMoney(p.amount)}
                    </span>
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
