import { Shell } from "@/components/dashboard/Shell";
import { ToastStack } from "@/components/ui/Toast";
import { PaymentPortal } from "@/components/features/PaymentPortal";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ParentBillingPage() {
  const [children, payments] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.payments.list(), [])
  ]);

  const child = children[0];
  const parentId = child?.parentId ?? "";
  const parentName = child?.parent?.user?.name ?? "Your account";

  const invoices = await safe(apiClient.invoices.forParent(parentId), []);

  const mappedInvoices = invoices.map((i) => ({
    id: i.id,
    amount: Number(i.amount),
    dueDate: i.dueDate,
    status: i.status
  }));

  const history = payments
    .filter((p) => invoices.some((i) => i.id === p.invoiceId))
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
    .map((p) => ({ id: p.invoiceId, amount: Number(p.amount), method: p.method, at: p.paidAt }));

  return (
    <Shell crumbs={["Parent", "Billing"]} title="Billing & payments">
      <ToastStack />
      <PaymentPortal invoices={mappedInvoices} history={history} parentName={parentName} />
    </Shell>
  );
}
