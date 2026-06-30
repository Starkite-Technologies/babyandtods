import { CreditCard } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentParent } from "@/lib/parent";
import { apiClient, formatDate, formatMoney, safe, type ApiInvoice } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Billing" };

export default async function ParentBilling() {
  const { parent } = await getCurrentParent();
  const invoices = parent ? await safe(apiClient.invoices.forParent(parent.id), []) : [];
  const paid = invoices.filter((invoice) => invoice.status === "paid").reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const outstanding = invoices.filter((invoice) => invoice.status !== "paid").reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const overdue = invoices.filter((invoice) => invoice.status === "overdue").length;

  return (
    <Shell crumbs={["Parent", "Billing"]} title="Billing">
      <section className="rounded-3xl border border-ink/20 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Live account balance</p>
            <h2 className="mt-1 text-3xl font-semibold text-ink">{formatMoney(outstanding)}</h2>
            <p className="mt-1 text-sm text-muted">{outstanding > 0 ? "Outstanding balance" : "No outstanding balance"}</p>
          </div>
          <Button href="/app/parent/messages" size="sm"><CreditCard className="h-4 w-4" /> Ask finance</Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniMetric label="Paid" value={formatMoney(paid)} />
          <MiniMetric label="Open invoices" value={String(invoices.filter((invoice) => invoice.status !== "paid").length)} />
          <MiniMetric label="Overdue" value={String(overdue)} danger={overdue > 0} />
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Invoices</p>
        <div className="mt-4 space-y-3">
          {invoices.map((invoice) => (
            <InvoiceRow key={invoice.id} invoice={invoice} />
          ))}
          {invoices.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">No live invoices are linked to this parent account yet.</p>
          )}
        </div>
      </section>
    </Shell>
  );
}

function MiniMetric({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-paper p-4">
      <p className={`text-xl font-semibold ${danger ? "text-red-700" : "text-ink"}`}>{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: ApiInvoice }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-paper p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
      <div>
        <p className="font-semibold text-ink">Invoice {invoice.id.slice(0, 8)}</p>
        <p className="mt-1 text-sm text-muted">Due {formatDate(invoice.dueDate)}</p>
      </div>
      <p className="font-semibold text-ink">{formatMoney(invoice.amount)}</p>
      <Badge tone={invoice.status === "paid" ? "success" : invoice.status === "overdue" ? "danger" : "warning"}>
        {invoice.status}
      </Badge>
    </div>
  );
}
