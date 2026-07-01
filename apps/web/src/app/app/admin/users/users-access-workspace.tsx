"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Loader2, Mail, Plus, Search, ShieldCheck, SlidersHorizontal, Trash2, UserRoundPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ApiAccountDirectory, ApiAccountDirectoryItem, ApiAdminAccessSummary } from "@/lib/api";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const emptySummary: ApiAdminAccessSummary = {
  email: { provider: "resend", configured: false, from: "not configured", mode: "unconfigured" },
  counts: { totalAccounts: 0, activeAccounts: 0, invitedAccounts: 0, verificationCount: 0, restrictedAccounts: 0 },
  classrooms: []
};

const emptyDirectory: ApiAccountDirectory = {
  page: 1,
  take: 20,
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
  const body = await response.text();
  if (!response.ok) throw new Error(readError(body));
  return body ? (JSON.parse(body) as T) : ({} as T);
}

export function UsersAccessWorkspace() {
  const [summary, setSummary] = useState<ApiAdminAccessSummary>(summaryCache ?? emptySummary);
  const [directory, setDirectory] = useState<ApiAccountDirectory>(emptyDirectory);
  const [selectedId, setSelectedId] = useState("");
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
    params.set("take", "20");
    return params.toString();
  }, [page, search, status, type]);

  const selected = directory.items.find((item) => item.id === selectedId) ?? directory.items[0] ?? null;
  const onboarding = directory.items.filter((item) => item.onboardingLocked);

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
        directoryCache.set(query, directoryResult.value);
        setDirectory(directoryResult.value);
        setSelectedId((current) => current || directoryResult.value.items[0]?.id || "");
      } else if (!cachedDirectory) {
        setNotice("Could not load live account data. Check that the API is running.");
      }

      if (summaryResult.status === "fulfilled") {
        summaryCache = summaryResult.value;
        setSummary(summaryResult.value);
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
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
    setSelectedId("");
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
        setNotice("Staff account created and invite sent.");
        setCreateOpen(false);
        await reloadAfterWrite();
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Account was not created.");
      }
    });
  }

  function resendInvite(account: ApiAccountDirectoryItem) {
    startTransition(async () => {
      try {
        await api("admin-access/invitations/send", {
          method: "POST",
          body: JSON.stringify({ userId: account.id, email: account.email, role: account.role })
        });
        setNotice(`Fresh invite sent to ${account.email}.`);
        await reloadAfterWrite();
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Invite was not sent.");
      }
    });
  }

  function cancelParentInvite(account: ApiAccountDirectoryItem) {
    startTransition(async () => {
      try {
        await api(`admin-access/users/${account.id}/onboarding`, { method: "DELETE" });
        setNotice(`Cancelled ${account.name}'s invite and removed linked learner records.`);
        setSelectedId("");
        await reloadAfterWrite();
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Could not cancel onboarding.");
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

      <section className="relative overflow-hidden rounded-3xl border border-ink/20 bg-white p-5 shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-rainbow" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Access desk</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Find the account, then manage the access layer.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Parents created from admissions stay invited until they set a password. Admin can re-send their invite or cancel the whole onboarding package.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-3xl border border-line bg-paper p-2">
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-2xl font-semibold text-ink">{onboarding.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">waiting setup</p>
            </div>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <UserRoundPlus className="h-4 w-4" />
              New staff
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <Metric label="Total" value={summary.counts.totalAccounts} />
          <Metric label="Active" value={summary.counts.activeAccounts} tone="success" />
          <Metric label="Invited" value={summary.counts.invitedAccounts} tone="warning" />
          <Metric label="Review" value={summary.counts.verificationCount} tone="accent" />
          <Metric label="Blocked" value={summary.counts.restrictedAccounts} tone="danger" />
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Directory</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Accounts</h3>
            </div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-brand-blue" /> : <Badge tone="info">Page {directory.page} / {directory.totalPages}</Badge>}
          </div>

          <form onSubmit={applyFilters} className="mt-5 grid gap-3 lg:grid-cols-[1fr_150px_170px_auto]">
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-line bg-paper px-3 text-sm text-muted">
              <Search className="h-4 w-4" />
              <input name="search" defaultValue={search} placeholder="Search name or email" className="w-full bg-transparent text-ink outline-none placeholder:text-muted" />
            </label>
            <select name="type" defaultValue={type} className="field h-11 rounded-2xl">
              <option value="">All people</option>
              <option value="staff">Staff</option>
              <option value="parent">Parents</option>
            </select>
            <select name="status" defaultValue={status} className="field h-11 rounded-2xl">
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

          <div className="mt-5 overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-[1.1fr_120px_1fr_120px] bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted max-lg:hidden">
              <span>Person</span>
              <span>Type</span>
              <span>Linked to</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-line">
              {directory.items.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedId(account.id)}
                  className={`grid w-full gap-3 px-4 py-4 text-left transition hover:bg-sky-50/70 lg:grid-cols-[1.1fr_120px_1fr_120px] lg:items-center ${selected?.id === account.id ? "bg-sky-50" : "bg-white"}`}
                >
                  <span>
                    <span className="block font-semibold text-ink">{account.name}</span>
                    <span className="mt-1 block truncate text-xs text-muted">{account.email}</span>
                  </span>
                  <span className="text-sm capitalize text-muted">{account.kind}</span>
                  <span className="text-sm text-ink">{account.primaryLink}</span>
                  <span>{statusBadge(account.status)}</span>
                </button>
              ))}
              {directory.items.length === 0 && (
                <p className="p-8 text-center text-sm text-muted">{loading ? "Loading accounts..." : "No accounts match this view."}</p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">Showing {directory.items.length} of {directory.total}</p>
            <div className="flex items-center gap-2">
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
        </div>

        <AccessPanel account={selected} pending={isPending} resendInvite={resendInvite} cancelParentInvite={cancelParentInvite} emailConfigured={summary.email.configured} />
      </section>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/25 p-3 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[1.5rem] border border-line bg-white p-5 shadow-lift">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Create staff account</p>
                <h3 className="mt-1 text-2xl font-semibold text-ink">Staff access is created here.</h3>
                <p className="mt-2 text-sm leading-6 text-muted">Parent accounts are created through approved admissions and learner enrolment.</p>
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

function AccessPanel({
  account,
  pending,
  resendInvite,
  cancelParentInvite,
  emailConfigured
}: {
  account: ApiAccountDirectoryItem | null;
  pending: boolean;
  resendInvite: (account: ApiAccountDirectoryItem) => void;
  cancelParentInvite: (account: ApiAccountDirectoryItem) => void;
  emailConfigured: boolean;
}) {
  if (!account) {
    return (
      <aside className="rounded-3xl border border-dashed border-line bg-white p-8 text-center shadow-soft">
        <ShieldCheck className="mx-auto h-8 w-8 text-muted" />
        <p className="mt-3 font-semibold text-ink">No account selected</p>
        <p className="mt-1 text-sm text-muted">Choose a person from the directory to manage access.</p>
      </aside>
    );
  }

  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <article className="overflow-hidden rounded-3xl border border-ink/15 bg-white shadow-soft">
        <div className="h-1.5 bg-rainbow" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Selected account</p>
              <h3 className="mt-1 truncate text-xl font-semibold text-ink">{account.name}</h3>
              <p className="mt-1 truncate text-sm text-muted">{account.email}</p>
            </div>
            {statusBadge(account.status)}
          </div>

          <div className="mt-5 grid gap-3">
            <InfoLine label="Type" value={account.kind} />
            <InfoLine label="Role" value={account.role} />
            <InfoLine label="Linked to" value={account.primaryLink} />
            <InfoLine label="Last login" value={displayDate(account.lastLogin)} />
          </div>

          {account.onboardingLocked && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
              This parent is invited but has not created a password yet. Re-send the invite, or cancel the application package and delete the linked learner.
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-line bg-paper p-5">
          {account.onboardingLocked ? (
            <>
              <Button disabled={pending || !emailConfigured} type="button" onClick={() => resendInvite(account)} className="w-full" variant="secondary">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Re-send invite link
              </Button>
              <Button disabled={pending} type="button" onClick={() => cancelParentInvite(account)} className="w-full !border-red-200 !text-red-700 hover:!bg-red-50" variant="outline">
                <Trash2 className="h-4 w-4" />
                Delete application & learner
              </Button>
            </>
          ) : (
            <>
              <Button href={`/app/admin/users/${account.id}`} className="w-full" variant="secondary">
                Open full profile
              </Button>
              <Button disabled={pending || !emailConfigured} type="button" onClick={() => resendInvite(account)} className="w-full" variant="secondary">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                Send invite link
              </Button>
            </>
          )}
          {!emailConfigured && <p className="text-xs leading-5 text-muted">Email must be configured before sending invitations.</p>}
        </div>
      </article>
    </aside>
  );
}

function Metric({ label, value, tone = "info" }: { label: string; value: number; tone?: BadgeTone }) {
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
    <div className="rounded-2xl border border-line bg-paper p-3">
      <p className={`text-xl font-semibold ${toneClass}`}>{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
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
    <div className="flex justify-between gap-3 rounded-2xl border border-line bg-paper px-3 py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="truncate text-right font-medium capitalize text-ink">{value}</span>
    </div>
  );
}

function statusBadge(status: string) {
  const tone: BadgeTone = status === "active" ? "success" : status === "suspended" || status === "archived" ? "danger" : status === "pending_verification" ? "warning" : status === "invited" ? "info" : "neutral";
  return <Badge tone={tone}>{status.replace("_", " ")}</Badge>;
}

function displayDate(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function readError(body: string) {
  try {
    const parsed = JSON.parse(body);
    return Array.isArray(parsed.message) ? parsed.message[0] : parsed.message ?? "Request failed";
  } catch {
    return body || "Request failed";
  }
}
