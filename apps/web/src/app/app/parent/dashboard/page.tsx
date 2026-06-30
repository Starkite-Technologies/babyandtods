import Link from "next/link";
import type { ReactNode } from "react";
import { Baby, CalendarCheck, CreditCard, MessageCircle, ShieldCheck, UserCheck } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentUser, initials } from "@/lib/auth";
import { ageFrom, apiClient, formatDate, formatMoney, formatTime, safe, type ApiAttendance, type ApiChild } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Parent Dashboard" };

export default async function ParentDashboard() {
  const user = await getCurrentUser();
  const [parents, attendance, messages, announcements] = await Promise.all([
    safe(apiClient.parents.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.messages.list(), []),
    safe(apiClient.announcements.list("parents"), [])
  ]);

  const parent = parents.find((item) => item.user.email.toLowerCase() === user?.email?.toLowerCase());
  const children = parent?.children ?? [];
  const invoices = parent ? await safe(apiClient.invoices.forParent(parent.id), []) : [];
  const childIds = new Set(children.map((child) => child.id));
  const childAttendance = attendance.filter((item) => childIds.has(item.childId));
  const balanceDue = invoices
    .filter((invoice) => invoice.status === "pending" || invoice.status === "overdue")
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0);
  const nextInvoice = invoices
    .filter((invoice) => invoice.status !== "paid")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
  const activeChild = children[0] ?? null;
  const activeAttendance = activeChild ? childAttendance.find((item) => item.childId === activeChild.id) : undefined;

  return (
    <Shell
      crumbs={["Parent", "Dashboard"]}
      title="Family dashboard"
      action={<Button href="/app/parent/messages" size="sm"><MessageCircle className="h-4 w-4" /> Message school</Button>}
    >
      <section className="parent-home-panel relative overflow-hidden rounded-3xl border border-ink/20 bg-white shadow-soft">
        <div className="absolute inset-x-0 top-0 h-2 bg-ink" aria-hidden />
        <div className="absolute inset-x-10 top-2 h-1 rounded-b-full bg-rainbow" aria-hidden />
        <div className="absolute bottom-0 left-0 top-0 hidden w-2 bg-ink lg:block" aria-hidden />
        <div className="absolute bottom-0 right-0 top-0 hidden w-2 bg-ink lg:block" aria-hidden />
        <div className="absolute -right-12 -top-12 hidden h-44 w-44 rounded-full border-[18px] border-brand-yellow/25 lg:block" aria-hidden />
        <div className="absolute bottom-8 right-12 hidden h-5 w-5 rounded-full bg-brand-green shadow-soft lg:block" aria-hidden />
        <div className="absolute bottom-16 right-24 hidden h-3 w-3 rounded-full bg-brand-pink shadow-soft lg:block" aria-hidden />

        <div className="grid gap-5 p-5 pt-8 lg:grid-cols-[1fr_360px] lg:p-8">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2 shadow-sm">
              <span className="family-mark flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
                {initials(user?.name ?? "Parent")}
              </span>
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Family access</span>
                <span className="block text-base font-semibold text-ink">Welcome back, {user?.name ?? "Parent"}</span>
              </span>
            </div>

            <div className="mt-5 grid max-w-3xl gap-3 sm:grid-cols-3">
              <FamilyStep href="/app/parent/attendance" icon={<CalendarCheck className="h-5 w-5" />} title="Today" detail={statusText(activeAttendance)} />
              <FamilyStep href="/app/parent/billing" icon={<CreditCard className="h-5 w-5" />} title="Billing" detail={balanceDue > 0 ? `${formatMoney(balanceDue)} due` : "Settled"} />
              <FamilyStep href="/app/parent/messages" icon={<MessageCircle className="h-5 w-5" />} title="Updates" detail={`${messages.length + announcements.length} live items`} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button href="/app/parent/child" size="sm"><Baby className="h-4 w-4" /> Child profile</Button>
              <Button href="/app/parent/check-in" size="sm" variant="secondary"><ShieldCheck className="h-4 w-4" /> Check-in</Button>
              <Button href="/app/parent/pickup-people" size="sm" variant="secondary"><UserCheck className="h-4 w-4" /> Pickup people</Button>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-line bg-paper/80 p-3">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Child layer</p>
              <Badge tone={children.length > 0 ? "success" : "warning"}>{children.length} linked</Badge>
            </div>
            {children.length > 0 ? (
              <div className="space-y-2">
                {children.slice(0, 3).map((child) => (
                  <ChildMiniCard key={child.id} child={child} attendance={childAttendance.find((item) => item.childId === child.id)} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line bg-white p-5 text-sm leading-6 text-muted">
                No child profile is linked to this parent account yet. The school office can link the learner from Users & Access.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Family shortcuts</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Open the next layer</h3>
            </div>
            <Baby className="h-5 w-5 text-muted" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <LayerLink href="/app/parent/attendance" icon={<CalendarCheck className="h-5 w-5" />} title="Attendance timeline" detail="Check arrival, pickup, and attendance history." />
            <LayerLink href="/app/parent/child" icon={<Baby className="h-5 w-5" />} title="Child profile" detail={activeChild ? `${activeChild.name}, ${ageFrom(activeChild.dateOfBirth)}` : "Waiting for linked learner profile."} />
            <LayerLink href="/app/parent/billing" icon={<CreditCard className="h-5 w-5" />} title="Payments" detail={nextInvoice ? `${formatMoney(nextInvoice.amount)} due ${formatDate(nextInvoice.dueDate)}` : "No unpaid invoice found."} />
            <LayerLink href="/app/parent/pickup-people" icon={<UserCheck className="h-5 w-5" />} title="Pickup access" detail="Review who the school can release your child to." />
          </div>
        </section>

        <div className="grid gap-5">
          <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">Billing</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{balanceDue > 0 ? formatMoney(balanceDue) : "No balance due"}</h3>
              </div>
              <Button href="/app/parent/billing" size="sm" variant="secondary">View billing</Button>
            </div>
            {nextInvoice ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">Next invoice</p>
                    <p className="mt-1 text-sm text-muted">Due {formatDate(nextInvoice.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">{formatMoney(nextInvoice.amount)}</p>
                    <Badge tone={nextInvoice.status === "overdue" ? "danger" : "warning"}>{nextInvoice.status}</Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-line bg-paper p-4 text-sm text-muted">No unpaid invoices are currently linked to this account.</p>
            )}
          </section>

          <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">School updates</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">Communication</h3>
              </div>
              <Button href="/app/parent/messages" size="sm" variant="secondary">Open</Button>
            </div>
            <div className="mt-4 space-y-3">
              {announcements.slice(0, 2).map((item) => (
                <Link key={item.id} href="/app/parent/messages" className="block rounded-2xl border border-line bg-paper p-4 transition hover:border-brand-blue/40">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-ink">{item.title}</p>
                    <Badge tone={item.audience === "all" ? "neutral" : "info"}>{item.audience}</Badge>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.body}</p>
                </Link>
              ))}
              {announcements.length === 0 && messages.length === 0 && (
                <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">No live updates yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}

function ChildMiniCard({ child, attendance }: { child: ApiChild; attendance?: ApiAttendance }) {
  return (
    <Link href="/app/parent/child" className="block rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:border-brand-blue/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{child.name}</p>
          <p className="mt-1 text-sm text-muted">{child.classroom?.name ?? "Classroom not assigned"} - {ageFrom(child.dateOfBirth)}</p>
        </div>
        <Badge tone={statusTone(attendance)}>{statusText(attendance)}</Badge>
      </div>
      {(attendance?.checkedInAt || attendance?.checkedOutAt) && (
        <p className="mt-3 text-xs text-muted">
          {attendance.checkedOutAt ? `Picked up ${formatTime(attendance.checkedOutAt)}` : `Arrived ${formatTime(attendance.checkedInAt)}`}
        </p>
      )}
    </Link>
  );
}

function FamilyStep({ href, icon, title, detail }: { href: string; icon: ReactNode; title: string; detail: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-soft">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white transition group-hover:bg-brand-pink">{icon}</span>
      <span className="mt-3 block font-semibold text-ink">{title}</span>
      <span className="mt-1 block text-sm text-muted">{detail}</span>
    </Link>
  );
}

function LayerLink({ href, icon, title, detail }: { href: string; icon: ReactNode; title: string; detail: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-4 transition hover:border-brand-blue/50 hover:shadow-soft">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">{icon}</span>
        <span>
          <span className="font-semibold text-ink">{title}</span>
          <span className="mt-1 block text-sm leading-5 text-muted">{detail}</span>
        </span>
      </div>
    </Link>
  );
}

function statusText(attendance?: ApiAttendance) {
  if (!attendance) return "Not marked";
  if (attendance.status === "checked-in") return "At school";
  if (attendance.status === "picked-up") return "Picked up";
  return "Absent";
}

function statusTone(attendance?: ApiAttendance): "neutral" | "success" | "warning" | "danger" | "info" | "accent" {
  if (!attendance) return "warning";
  if (attendance.status === "checked-in") return "success";
  if (attendance.status === "picked-up") return "info";
  return "danger";
}
