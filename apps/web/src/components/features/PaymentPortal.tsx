"use client";

import { useMemo, useState, useTransition } from "react";
import { CreditCard, Building2, Smartphone, Check, X, Zap, Receipt } from "lucide-react";
import { recordPaymentAction } from "@/lib/actions";
import { toast } from "@/components/ui/Toast";

type Invoice = { id: string; amount: number; dueDate: string; status: "paid" | "pending" | "overdue" };
type Receipt = { id: string; amount: number; method: string; at: string };

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NA", { style: "currency", currency: "NAD", maximumFractionDigits: 0 })
    .format(n)
    .replace("ZAR", "N$")
    .replace("NAD", "N$");

const methods = [
  { key: "Card", label: "Debit / Credit card", icon: CreditCard },
  { key: "Bank transfer", label: "Instant EFT", icon: Building2 },
  { key: "Mobile money", label: "Mobile money", icon: Smartphone }
];

export function PaymentPortal({
  invoices: initialInvoices,
  history: initialHistory,
  parentName
}: {
  invoices: Invoice[];
  history: Receipt[];
  parentName: string;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [receipts, setReceipts] = useState<Receipt[]>(initialHistory);
  const [autopay, setAutopay] = useState(false);
  const [active, setActive] = useState<Invoice | null>(null);
  const [method, setMethod] = useState(methods[0].key);
  const [processing, setProcessing] = useState(false);
  const [, startTransition] = useTransition();

  const outstanding = useMemo(
    () => invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0),
    [invoices]
  );
  const overdue = invoices.some((i) => i.status === "overdue");

  function pay() {
    if (!active) return;
    setProcessing(true);
    const inv = active;
    setTimeout(() => {
      setInvoices((prev) => prev.map((i) => (i.id === inv.id ? { ...i, status: "paid" } : i)));
      setReceipts((prev) => [{ id: inv.id, amount: inv.amount, method, at: new Date().toISOString() }, ...prev]);
      setProcessing(false);
      setActive(null);
      toast(`${fmt(inv.amount)} paid · receipt sent`, "success");
      startTransition(async () => {
        await recordPaymentAction({ invoiceId: inv.id, amount: inv.amount, method });
      });
    }, 1100);
  }

  const unpaid = invoices.filter((i) => i.status !== "paid");

  return (
    <>
      {/* Hero balance */}
      <div className="glass-dark glass-accent-top rounded-2xl p-6 text-paper sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">Outstanding balance</p>
            <p className="mt-2 font-display text-5xl font-medium tracking-tight">{fmt(outstanding)}</p>
            <p className="mt-2 text-sm text-paper/60">
              {outstanding === 0 ? "You're all settled — thank you!" : `${unpaid.length} invoice${unpaid.length > 1 ? "s" : ""} awaiting payment`}
              {overdue && <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-300">Overdue</span>}
            </p>
          </div>
          <button
            onClick={() => setAutopay((a) => !a)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
              autopay ? "bg-accent text-white glow-accent" : "bg-white/10 text-paper/80 ring-1 ring-inset ring-white/15 hover:bg-white/15"
            }`}
          >
            <Zap className="h-4 w-4" />
            Auto-pay {autopay ? "on" : "off"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Invoices */}
        <div className="glass rounded-2xl p-5 sm:p-6">
          <h3 className="mb-4 text-sm font-semibold text-ink">Invoices</h3>
          {invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No invoices on file.</p>
          ) : (
            <div className="space-y-2.5">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between gap-4 rounded-2xl bg-white/50 p-4 ring-1 ring-inset ring-white/50"
                >
                  <div>
                    <p className="font-display text-lg font-medium text-ink">{fmt(inv.amount)}</p>
                    <p className="text-xs text-muted">
                      Due {new Date(inv.dueDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {inv.status === "paid" ? (
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200/60">
                      <Check className="h-3.5 w-3.5" /> Paid
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setActive(inv);
                        setMethod(methods[0].key);
                      }}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                        inv.status === "overdue" ? "bg-red-500 hover:bg-red-600" : "bg-ink hover:bg-ink-800"
                      }`}
                    >
                      Pay now
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Receipts */}
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Receipt className="h-4 w-4 text-ink-400" />
            <h3 className="text-sm font-semibold text-ink">Receipts</h3>
          </div>
          {receipts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">Payments you make will appear here.</p>
          ) : (
            <ul className="space-y-2.5">
              {receipts.map((r, i) => (
                <li key={`${r.id}-${i}`} className="animate-rise flex items-center justify-between gap-3 border-b border-line/60 pb-2.5 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold text-emerald-600">+{fmt(r.amount)}</p>
                    <p className="text-[11px] text-muted">
                      {r.method} · {new Date(r.at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200/60">
                    Receipt
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Payment modal */}
      {active && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => !processing && setActive(null)} />
          <div className="glass-strong animate-rise relative z-10 w-full max-w-md rounded-3xl p-6">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Pay invoice</p>
                <p className="mt-1 font-display text-3xl font-medium tracking-tight text-ink">{fmt(active.amount)}</p>
                <p className="text-xs text-muted">{parentName}</p>
              </div>
              <button
                onClick={() => !processing && setActive(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-ink-500 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Payment method</p>
            <div className="space-y-2">
              {methods.map((m) => {
                const Icon = m.icon;
                const on = method === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      on ? "border-accent bg-accent-50/70" : "border-white/60 bg-white/50 hover:bg-white"
                    }`}
                  >
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${on ? "bg-accent text-white" : "bg-white/70 text-ink-500"}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="flex-1 text-sm font-medium text-ink">{m.label}</span>
                    {on && <Check className="h-4 w-4 text-accent" />}
                  </button>
                );
              })}
            </div>

            <button
              onClick={pay}
              disabled={processing}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3.5 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-80"
            >
              {processing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing…
                </>
              ) : (
                <>Pay {fmt(active.amount)}</>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] text-muted">Secured · encrypted · instant receipt</p>
          </div>
        </div>
      )}
    </>
  );
}
