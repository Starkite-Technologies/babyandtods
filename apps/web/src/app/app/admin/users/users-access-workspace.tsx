"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Loader2, Mail, Plus, Search, SlidersHorizontal, UserRoundPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable } from "@/components/ui/DataTable";
import type { ApiAccountDirectory, ApiAdminAccessSummary } from "@/lib/api";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const emptySummary: ApiAdminAccessSummary = {
  email: { provider: "resend", configured: false, from: "not configured", mode: "unconfigured" },
  counts: { totalAccounts: 0, activeAccounts: 0, invitedAccounts: 0, verificationCount: 0, restrictedAccounts: 0 },
  invitations: [],
  auditLogs: [],
  classrooms: [],
  children: []
};

const emptyDirectory: ApiAccountDirectory = {
  page: 1,
  take: 25,
  total: 0,
  totalPages: 1,
  items: []
};

const directoryCache = new Map<string, ApiAccountDirectory>();
let summaryCache: ApiAdminAccessSummary | null = null;

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/proxy/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}

export function UsersAccessWorkspace() {
  const [summary, setSummary] = useState<ApiAdminAccessSummary>(summaryCache ?? emptySummary);
  const [directory, setDirectory] = useState<ApiAccountDirectory>(emptyDirectory);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const requestId = useRef(0);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    params.set("page", String(page));
    params.set("take", "25");
    return params.toString();
  }, [page, search, status, type]);

  async function load() {
    const id = ++requestId.current;
    const cachedDirectory = directoryCache.get(query);
    if (cachedDirectory) {
      setDirectory(cachedDirectory);
      setLoading(false);
    } else {
      setLoading(true);
    }

    try {
      const [directoryResult, summaryResult] = await Promise.allSettled([
        api<ApiAccountDirectory>(`admin-access/accounts?${query}`),
        summaryCache ? Promise.resolve(summaryCache) : api<ApiAdminAccessSummary>("admin-access")
      ]);

      if (id !== requestId.current) return;

      if (directoryResult.status === "fulfilled") {
        const nextDirectory = directoryResult.value;
        directoryCache.set(query, nextDirectory);
        setDirectory(nextDirectory);
      } else if (!cachedDirectory) {
        setNotice("Could not load live account data. Check that the API is running.");
      }

      if (summaryResult.status === "fulfilled") {
        summaryCache = summaryResult.value;
        setSummary(summaryResult.value);
      } else {
        setNotice("Account activity could not load. Directory is still available.");
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  async function refresh() {
    summaryCache = null;
    directoryCache.delete(query);
    await load();
  }

  async function reloadAfterWrite() {
    summaryCache = null;
    directoryCache.clear();
    await load();
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSearch(String(form.get("search") ?? ""));
    setType(String(form.get("type") ?? ""));
    setStatus(String(form.get("status") ?? ""));
    setPage(1);
  }

  async function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      role: String(form.get("role") ?? "teacher"),
      assignedClassroomId: String(form.get("assignedClassroomId") ?? "") || undefined,
      employmentStatus: String(form.get("employmentStatus") ?? "")
    };

    startTransition(async () => {
      try {
        await api("admin-access/staff", { method: "POST", body: JSON.stringify(body) });
        setNotice("Account created. Invitation email was sent if email is configured.");
        setCreateOpen(false);
        await reloadAfterWrite();
      } catch {
        setNotice("Account was not created. Check required fields and email configuration.");
      }
    });
  }

  async function sendInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      try {
        await api("admin-access/invitations/send", {
          method: "POST",
          body: JSON.stringify({
            email: String(form.get("email") ?? ""),
            role: String(form.get("role") ?? "parent")
          })
        });
        setNotice("Invitation email sent.");
        await reloadAfterWrite();
      } catch (error) {
        setNotice(error instanceof Error && error.message ? cleanError(error.message) : "Invitation was not sent. Create the account first and check email configuration.");
      }
    });
  }

  return (
    <div className="space-y-5">
      {notice && (
        <div className="flex items-center justify-between rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink shadow-soft">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} className="text-muted transition hover:text-ink" aria-label="Dismiss">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-[1.5rem] border border-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">Account governance</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Manage access, invitations, and restrictions.</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Use filters to find people quickly, then open a profile before changing account access.
            </p>
          </div>
          <div className="flex flex-col gap-3 xl:min-w-[720px]">
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" onClick={() => setCreateOpen(true)}>
                <UserRoundPlus className="h-4 w-4" />
                New staff
              </Button>
              <Button size="sm" variant="secondary" onClick={() => void refresh()} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Refresh
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-5">
              <MiniMetric label="Total" value={summary.counts.totalAccounts} />
              <MiniMetric label="Active" value={summary.counts.activeAccounts} tone="success" />
              <MiniMetric label="Invited" value={summary.counts.invitedAccounts} tone="warning" />
              <MiniMetric label="Verify" value={summary.counts.verificationCount} tone="accent" />
              <MiniMetric label="Blocked" value={summary.counts.restrictedAccounts} tone="danger" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <Card
          title="Account directory"
          description={loading ? "Loading live accounts..." : `Showing ${directory.items.length} of ${directory.total} accounts`}
          action={loading ? <Loader2 className="h-4 w-4 animate-spin text-brand-blue" /> : <Badge tone="info">Page {directory.page} / {directory.totalPages}</Badge>}
        >
          <form onSubmit={applyFilters} className="mb-4 grid gap-3 lg:grid-cols-[1fr_150px_170px_auto]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input name="search" defaultValue={search} placeholder="Search name or email" className="h-11 w-full rounded-full border border-line bg-white pl-9 pr-4 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10" />
            </label>
            <select name="type" defaultValue={type} className="h-11 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10">
              <option value="">All people</option>
              <option value="staff">Staff</option>
              <option value="parent">Parents</option>
            </select>
            <select name="status" defaultValue={status} className="h-11 rounded-full border border-line bg-white px-4 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10">
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="pending_verification">Pending verification</option>
              <option value="suspended">Suspended</option>
            </select>
            <Button type="submit" variant="secondary">
              <SlidersHorizontal className="h-4 w-4" />
              Apply
            </Button>
          </form>

          <DataTable
            columns={["Name", "Type", "Role", "Linked to", "Status", "Last login"]}
            rowHref={(index) => `/app/admin/users/${directory.items[index]?.id}`}
            rows={directory.items.map((account) => [
              account.name,
              account.kind,
              account.role,
              account.primaryLink,
              statusBadge(account.status),
              displayDate(account.lastLogin)
            ])}
            empty={loading ? "Loading..." : "No accounts match this filter."}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Open a row to manage the full profile.</p>
            <div className="flex gap-2">
              <Button disabled={directory.page <= 1 || loading} onClick={() => setPage((p) => Math.max(p - 1, 1))} size="sm" variant="secondary">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button disabled={directory.page >= directory.totalPages || loading} onClick={() => setPage((p) => Math.min(p + 1, directory.totalPages))} size="sm" variant="secondary">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <aside className="space-y-5">
          <Card title="Re-send invite" description="Send a fresh invitation to an existing account.">
            <form onSubmit={sendInvite} className="space-y-3">
              <input name="email" type="email" placeholder="person@email.com" required className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10" />
              <select name="role" className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10">
                <option value="teacher">Staff</option>
                <option value="finance">Finance</option>
                <option value="admin">Admin</option>
              </select>
              <Button disabled={isPending} type="submit" className="w-full" variant="secondary">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send fresh invite
              </Button>
            </form>
          </Card>

          <Card
            title="Email status"
            description={summary.email.configured ? "Ready to send real invitations." : "Configure email before inviting users."}
            action={<Badge tone={summary.email.configured ? "success" : "danger"}>{summary.email.mode}</Badge>}
          >
            <div className="space-y-2 text-sm">
              <InfoLine label="Provider" value={summary.email.provider} />
              <InfoLine label="From" value={summary.email.from} />
            </div>
          </Card>

          <Card title="Recent activity" description="Latest access events only.">
            <div className="space-y-3">
              {summary.auditLogs.length === 0 && <p className="text-sm text-muted">No access events yet.</p>}
              {summary.auditLogs.slice(0, 4).map((log) => (
                <Link key={log.id} href="/app/admin/users" className="block rounded-2xl border border-line bg-white p-3 transition hover:border-brand-blue/40">
                  <p className="text-sm font-medium text-ink">{log.event.replaceAll("_", " ")}</p>
                  <p className="mt-1 truncate text-xs text-muted">{log.target}</p>
                </Link>
              ))}
            </div>
          </Card>
        </aside>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/25 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-line bg-white p-5 shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Create staff account</p>
                <h3 className="mt-1 text-2xl font-semibold text-ink">Staff access is created here.</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Parent accounts are created only through approved admissions and learner enrolment.</p>
              </div>
              <button onClick={() => setCreateOpen(false)} className="rounded-full border border-line bg-white p-2 text-muted transition hover:text-ink" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={createAccount} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field name="fullName" label="Full name" required />
                <Field name="email" label="Email" type="email" required />
                <Field name="phone" label="Phone" />
                <Select name="role" label="Role" options={["teacher", "finance", "admin"]} />
                <Select name="assignedClassroomId" label="Classroom" options={summary.classrooms.map((room) => ({ label: room.name, value: room.id }))} />
                <Select name="employmentStatus" label="Employment" options={["active", "probation", "contract", "inactive"]} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button disabled={isPending} type="submit">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Create staff
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniMetric({ label, value, tone = "info" }: { label: string; value: number; tone?: BadgeTone }) {
  const toneClass = tone === "success"
    ? "text-brand-green"
    : tone === "danger"
      ? "text-red-700"
      : tone === "warning"
        ? "text-brand-orange"
        : tone === "accent"
          ? "text-brand-blue"
          : "text-ink";
  return (
    <div className="rounded-2xl border border-line bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${toneClass}`}>{value}</p>
    </div>
  );
}

function Field({ name, label, type = "text", required }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <input name={name} type={type} required={required} className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10" />
    </label>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: Array<string | { label: string; value: string }> }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <select name={name} className="mt-1 h-10 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10">
        <option value="">Select</option>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const label = typeof option === "string" ? option : option.label;
          return <option key={value} value={value}>{label}</option>;
        })}
      </select>
    </label>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-xl border border-line bg-white px-3 py-2">
      <span className="text-muted">{label}</span>
      <span className="truncate font-medium text-ink">{value}</span>
    </div>
  );
}

function statusBadge(status: string) {
  const tone: BadgeTone = status === "active" ? "success" : status === "suspended" || status === "archived" ? "danger" : status === "pending_verification" ? "warning" : status === "invited" ? "info" : "neutral";
  return { kind: "badge" as const, text: status.replace("_", " "), tone };
}

function displayDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function cleanError(message: string) {
  try {
    const parsed = JSON.parse(message);
    return parsed.message ?? message;
  } catch {
    return message.replace(/^API error:\s*/i, "");
  }
}
