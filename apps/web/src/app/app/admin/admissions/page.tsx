import Link from "next/link";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, GraduationCap, Mail, Phone, Search, Trash2, UserPlus, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient, formatDate, safe, type ApiAdmissionApplication } from "@/lib/api";
import { clearAdmissionsAction, deleteAdmissionAction, enrolAdmissionAction, updateAdmissionStatusAction } from "@/lib/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admissions" };
const pageSize = 12;

const orderedStatuses: ApiAdmissionApplication["status"][] = [
  "new",
  "reviewing",
  "tour-booked",
  "waitlisted",
  "approved",
  "enrolled",
  "rejected"
];

export default async function AdminAdmissionsPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string; q?: string; page?: string; selected?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus = orderedStatuses.includes(params?.status as ApiAdmissionApplication["status"])
    ? (params?.status as ApiAdmissionApplication["status"])
    : "all";
  const query = (params?.q ?? "").trim().toLowerCase();
  const page = Math.max(1, Number(params?.page ?? "1") || 1);

  const [applications, classrooms] = await Promise.all([
    safe(apiClient.admissions.list(), []),
    safe(apiClient.classrooms.list(), [])
  ]);

  const filtered = applications.filter((item) => {
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const haystack = `${item.childName} ${item.parentName} ${item.parentEmail} ${item.parentPhone} ${item.programme}`.toLowerCase();
    return matchesStatus && (!query || haystack.includes(query));
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selected = applications.find((item) => item.id === params?.selected) ?? pageItems[0] ?? applications[0] ?? null;
  const counts = orderedStatuses.map((status) => ({
    status,
    count: applications.filter((item) => item.status === status).length
  }));
  const active = applications.filter((item) => item.status !== "enrolled" && item.status !== "rejected");

  return (
    <Shell
      crumbs={["Admin", "Admissions"]}
      title="Admissions"
      action={<Button href="/admissions" size="sm" variant="secondary">Open public form</Button>}
    >
      <section className="relative overflow-hidden rounded-3xl border border-ink/20 bg-white p-5 shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-rainbow" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Admissions desk</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Queue, decide, then enrol.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Families submit applications from the public site. Admin reviews the selected profile layer before approval, rejection, or learner creation.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-3xl border border-line bg-paper p-2">
            <div className="rounded-2xl bg-white px-4 py-3">
              <p className="text-2xl font-semibold text-ink">{active.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">active</p>
            </div>
            <form action={clearAdmissionsAction}>
              <Button type="submit" size="sm" variant="outline" className="!border-red-200 !text-red-700 hover:!bg-red-50">
                <Trash2 className="h-4 w-4" /> Clear all
              </Button>
            </form>
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {counts.map((item) => (
            <StatusLink key={item.status} status={item.status} count={item.count} active={selectedStatus === item.status} query={params?.q} />
          ))}
        </div>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Queue</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Applicants</h3>
            </div>
            <Button href={buildUrl({ status: undefined, q: undefined, page: "1", selected: undefined })} size="sm" variant={selectedStatus === "all" && !query ? "primary" : "secondary"}>
              All applications
            </Button>
          </div>

          <form className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_auto]" action="/app/admin/admissions">
            <label className="flex h-11 items-center gap-2 rounded-2xl border border-line bg-paper px-3 text-sm text-muted">
              <Search className="h-4 w-4" />
              <input name="q" defaultValue={params?.q ?? ""} className="w-full bg-transparent text-ink outline-none placeholder:text-muted" placeholder="Search child, parent, email, phone" />
            </label>
            <select name="status" defaultValue={selectedStatus} className="field h-11 rounded-2xl">
              <option value="all">All statuses</option>
              {orderedStatuses.map((status) => (
                <option key={status} value={status}>{labelStatus(status)}</option>
              ))}
            </select>
            <Button type="submit" size="md" variant="secondary">Apply</Button>
          </form>

          <div className="mt-5 overflow-hidden rounded-2xl border border-line">
            <div className="grid grid-cols-[1.2fr_1fr_150px_120px] bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted max-lg:hidden">
              <span>Applicant</span>
              <span>Guardian</span>
              <span>Stage</span>
              <span className="text-right">Applied</span>
            </div>
            <div className="divide-y divide-line">
              {pageItems.map((application) => (
                <ApplicantRow key={application.id} application={application} active={selected?.id === application.id} params={params} />
              ))}
              {pageItems.length === 0 && (
                <p className="p-8 text-center text-sm text-muted">
                  No applications match this view.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing {pageItems.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button href={buildUrl({ ...params, page: String(Math.max(1, currentPage - 1)), selected: undefined })} size="sm" variant="secondary" disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="rounded-full border border-line bg-paper px-3 py-2 text-sm font-medium text-ink">
                Page {currentPage} / {totalPages}
              </span>
              <Button href={buildUrl({ ...params, page: String(Math.min(totalPages, currentPage + 1)), selected: undefined })} size="sm" variant="secondary" disabled={currentPage === totalPages}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <ApplicationPanel application={selected} classrooms={classrooms} />
      </section>
    </Shell>
  );
}

function StatusLink({
  status,
  count,
  active,
  query
}: {
  status: ApiAdmissionApplication["status"];
  count: number;
  active: boolean;
  query?: string;
}) {
  return (
    <Link
      href={buildUrl({ status, q: query, page: "1", selected: undefined })}
      className={`rounded-2xl border p-3 transition hover:border-brand-blue/50 ${active ? "border-brand-blue bg-sky-50" : "border-line bg-paper"}`}
    >
      <p className="text-xl font-semibold text-ink">{count}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{labelStatus(status)}</p>
    </Link>
  );
}

function ApplicantRow({
  application,
  active,
  params
}: {
  application: ApiAdmissionApplication;
  active: boolean;
  params?: { status?: string; q?: string; page?: string; selected?: string };
}) {
  return (
    <Link
      href={buildUrl({ ...params, selected: application.id })}
      className={`grid gap-3 px-4 py-4 transition hover:bg-sky-50/70 lg:grid-cols-[1.2fr_1fr_150px_120px] lg:items-center ${active ? "bg-sky-50" : "bg-white"}`}
    >
      <div>
        <p className="font-semibold text-ink">{application.childName}</p>
        <p className="mt-1 text-sm text-muted">{application.programme}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{application.parentName}</p>
        <p className="mt-1 truncate text-xs text-muted">{application.parentEmail}</p>
      </div>
      <Badge tone={statusTone(application.status)}>{labelStatus(application.status)}</Badge>
      <p className="text-sm text-muted lg:text-right">{formatDate(application.createdAt)}</p>
    </Link>
  );
}

function ApplicationPanel({
  application,
  classrooms
}: {
  application: ApiAdmissionApplication | null;
  classrooms: Array<{ id: string; name: string; ageGroup: string }>;
}) {
  if (!application) {
    return (
      <aside className="rounded-3xl border border-dashed border-line bg-white p-8 text-center shadow-soft">
        <ClipboardCheck className="mx-auto h-8 w-8 text-muted" />
        <p className="mt-3 font-semibold text-ink">No application selected</p>
        <p className="mt-1 text-sm text-muted">New family applications will open here for review.</p>
      </aside>
    );
  }

  const canEnrol = application.status === "approved" || application.status === "tour-booked" || application.status === "waitlisted";

  return (
    <aside className="xl:sticky xl:top-24 xl:self-start">
      <article className="overflow-hidden rounded-3xl border border-ink/15 bg-white shadow-soft">
        <div className="bg-rainbow h-1.5" />
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Selected application</p>
              <h3 className="mt-1 text-xl font-semibold text-ink">{application.childName}</h3>
              <p className="mt-1 text-sm text-muted">{application.programme}</p>
            </div>
            <Badge tone={statusTone(application.status)}>{labelStatus(application.status)}</Badge>
          </div>

          <div className="mt-5 grid gap-3">
            <Info icon={<UserPlus className="h-4 w-4" />} label="Parent" value={application.parentName} />
            <Info icon={<Mail className="h-4 w-4" />} label="Email" value={application.parentEmail} />
            <Info icon={<Phone className="h-4 w-4" />} label="Phone" value={application.parentPhone} />
            <Info icon={<CalendarDays className="h-4 w-4" />} label="Preferred start" value={formatDate(application.preferredStart)} />
          </div>

          {application.notes && (
            <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Family notes</p>
              <p className="mt-2 text-sm leading-6 text-ink">{application.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-line bg-paper p-5">
          <div className="grid grid-cols-2 gap-2">
            <DecisionButton id={application.id} status="approved" icon={<CheckCircle2 className="h-4 w-4" />}>Approve</DecisionButton>
            <DecisionButton id={application.id} status="rejected" danger icon={<XCircle className="h-4 w-4" />}>Reject</DecisionButton>
            <DecisionButton id={application.id} status="tour-booked" secondary icon={<CalendarDays className="h-4 w-4" />}>Book tour</DecisionButton>
            <DecisionButton id={application.id} status="waitlisted" secondary icon={<ClipboardCheck className="h-4 w-4" />}>Waitlist</DecisionButton>
          </div>

          <form action={enrolAdmissionAction} className="space-y-3 border-t border-line pt-3">
            <input type="hidden" name="id" value={application.id} />
            <label className="text-xs font-semibold uppercase tracking-wider text-muted" htmlFor={`classroom-${application.id}`}>Enrol as learner</label>
            <select id={`classroom-${application.id}`} name="classroomId" className="field" disabled={!canEnrol || application.status === "enrolled"}>
              <option value="">No classroom yet</option>
              {classrooms.map((classroom) => (
                <option key={classroom.id} value={classroom.id}>{classroom.name} - {classroom.ageGroup}</option>
              ))}
            </select>
            <input name="preferredStart" type="date" className="field" defaultValue={application.preferredStart?.slice(0, 10) ?? ""} disabled={!canEnrol || application.status === "enrolled"} />
            <Button type="submit" size="sm" className="w-full" disabled={!canEnrol || application.status === "enrolled"}>
              <GraduationCap className="h-4 w-4" /> Create learner
            </Button>
            {application.status === "enrolled" && (
              <p className="flex items-center gap-2 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Learner profile already created.
              </p>
            )}
            {!canEnrol && application.status !== "enrolled" && (
              <p className="text-xs leading-5 text-muted">Move this application to Approved, Tour booked, or Waitlisted before enrolment.</p>
            )}
          </form>

          <form action={deleteAdmissionAction} className="border-t border-line pt-4">
            <input type="hidden" name="id" value={application.id} />
            <Button type="submit" size="sm" variant="outline" className="w-full !border-red-200 !text-red-700 hover:!bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete application
            </Button>
          </form>
        </div>
      </article>
    </aside>
  );
}

function DecisionButton({
  id,
  status,
  children,
  icon,
  danger,
  secondary
}: {
  id: string;
  status: ApiAdmissionApplication["status"];
  children: ReactNode;
  icon: ReactNode;
  danger?: boolean;
  secondary?: boolean;
}) {
  return (
    <form action={updateAdmissionStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <input type="hidden" name="adminNote" value="" />
      <Button type="submit" size="sm" variant={danger || secondary ? "outline" : "primary"} className={danger ? "w-full !border-red-200 !text-red-700 hover:!bg-red-50" : "w-full"}>
        {icon} {children}
      </Button>
    </form>
  );
}

function Info({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-3">
      <span className="mt-0.5 text-brand-blue">{icon}</span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
        <span className="mt-1 block text-sm font-medium text-ink">{value || "Not provided"}</span>
      </span>
    </div>
  );
}

function labelStatus(status: string) {
  return status.replace(/-/g, " ");
}

function statusTone(status: ApiAdmissionApplication["status"]): "neutral" | "success" | "warning" | "danger" | "info" | "accent" {
  if (status === "approved" || status === "enrolled") return "success";
  if (status === "rejected") return "danger";
  if (status === "waitlisted" || status === "tour-booked") return "warning";
  if (status === "reviewing") return "info";
  return "accent";
}

function buildUrl(params: { status?: string; q?: string; page?: string; selected?: string }) {
  const query = new URLSearchParams();
  if (params.status && params.status !== "all") query.set("status", params.status);
  if (params.q) query.set("q", params.q);
  if (params.page && params.page !== "1") query.set("page", params.page);
  if (params.selected) query.set("selected", params.selected);
  const suffix = query.toString();
  return `/app/admin/admissions${suffix ? `?${suffix}` : ""}`;
}
