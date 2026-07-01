import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, UserRound } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient, ageFrom, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
const pageSize = 24;

export default async function AdminLearnersPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; classroom?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = (params?.q ?? "").trim().toLowerCase();
  const classroom = params?.classroom ?? "all";
  const page = Math.max(1, Number(params?.page ?? "1") || 1);

  const [children, attendance, allergies] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.allergies.list(), [])
  ]);

  const classrooms = Array.from(new Set(children.map((child) => child.classroom?.name ?? "Unassigned"))).sort();
  const attendanceMap = Object.fromEntries(attendance.map((a) => [a.childId, a]));
  const allergyMap: Record<string, typeof allergies> = {};
  for (const allergy of allergies) {
    allergyMap[allergy.childId] = [...(allergyMap[allergy.childId] ?? []), allergy];
  }

  const filtered = children.filter((child) => {
    const className = child.classroom?.name ?? "Unassigned";
    const haystack = `${child.name} ${className} ${child.parent?.user?.name ?? ""} ${child.parent?.user?.email ?? ""}`.toLowerCase();
    return (classroom === "all" || className === classroom) && (!query || haystack.includes(query));
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Shell crumbs={["Admin", "Learners"]} title="Learners">
      <section className="relative overflow-hidden rounded-3xl border border-ink/20 bg-white p-5 shadow-soft">
        <div className="absolute inset-x-0 top-0 h-1.5 bg-rainbow" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Learner directory</p>
            <h2 className="mt-1 text-2xl font-semibold text-ink">Search first, open the profile layer.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Learners stay compact in the directory. Open a row for the full learner profile, records, parent links, and classroom detail.
            </p>
          </div>
          <div className="rounded-3xl border border-line bg-paper p-2">
            <div className="rounded-2xl bg-white px-5 py-3">
              <p className="text-2xl font-semibold text-ink">{children.length}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">enrolled</p>
            </div>
          </div>
        </div>

        <form className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_auto]" action="/app/admin/learners">
          <label className="flex h-11 items-center gap-2 rounded-2xl border border-line bg-paper px-3 text-sm text-muted">
            <Search className="h-4 w-4" />
            <input name="q" defaultValue={params?.q ?? ""} className="w-full bg-transparent text-ink outline-none placeholder:text-muted" placeholder="Search learner, parent, class" />
          </label>
          <select name="classroom" defaultValue={classroom} className="field h-11 rounded-2xl">
            <option value="all">All classrooms</option>
            {classrooms.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <Button type="submit" variant="secondary">Apply</Button>
        </form>
      </section>

      <section className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Directory</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">Learners</h3>
          </div>
          <Badge tone="info">Page {currentPage} / {totalPages}</Badge>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          <div className="grid grid-cols-[1.2fr_150px_1fr_140px_120px] bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted max-lg:hidden">
            <span>Learner</span>
            <span>Age</span>
            <span>Parent</span>
            <span>Attendance</span>
            <span>Alerts</span>
          </div>
          <div className="divide-y divide-line">
            {pageItems.map((child) => {
              const att = attendanceMap[child.id];
              const childAllergies = allergyMap[child.id] ?? [];
              const hasSevere = childAllergies.some((allergy) => allergy.severity === "severe");
              return (
                <Link
                  key={child.id}
                  href={`/app/admin/learners/${child.id}`}
                  className="grid gap-3 bg-white px-4 py-4 transition hover:bg-sky-50/70 lg:grid-cols-[1.2fr_150px_1fr_140px_120px] lg:items-center"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
                      {child.name.slice(0, 1).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{child.name}</span>
                      <span className="mt-1 block truncate text-xs text-muted">{child.classroom?.name ?? "Unassigned"}</span>
                    </span>
                  </span>
                  <span className="text-sm text-muted">{ageFrom(child.dateOfBirth)}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{child.parent?.user?.name ?? "No parent linked"}</span>
                    <span className="mt-1 block truncate text-xs text-muted">{child.parent?.user?.email ?? ""}</span>
                  </span>
                  <span>{attendanceBadge(att?.status)}</span>
                  <span>
                    {childAllergies.length > 0 ? (
                      <Badge tone={hasSevere ? "danger" : "warning"}>{childAllergies.length} alert{childAllergies.length === 1 ? "" : "s"}</Badge>
                    ) : (
                      <span className="text-sm text-muted">None</span>
                    )}
                  </span>
                </Link>
              );
            })}
            {pageItems.length === 0 && (
              <div className="p-8 text-center">
                <UserRound className="mx-auto h-8 w-8 text-muted" />
                <p className="mt-3 font-semibold text-ink">No learners found</p>
                <p className="mt-1 text-sm text-muted">Approved admissions will create learner profiles here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted">
            Showing {pageItems.length ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button href={buildUrl({ ...params, page: String(Math.max(1, currentPage - 1)) })} size="sm" variant="secondary" disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button href={buildUrl({ ...params, page: String(Math.min(totalPages, currentPage + 1)) })} size="sm" variant="secondary" disabled={currentPage === totalPages}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function attendanceBadge(status?: string) {
  if (status === "checked-in") return <Badge tone="success">Present</Badge>;
  if (status === "absent") return <Badge tone="warning">Absent</Badge>;
  if (status === "picked-up") return <Badge tone="neutral">Picked up</Badge>;
  return <span className="text-sm text-muted">Unmarked</span>;
}

function buildUrl(params: { q?: string; classroom?: string; page?: string }) {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.classroom && params.classroom !== "all") query.set("classroom", params.classroom);
  if (params.page && params.page !== "1") query.set("page", params.page);
  const suffix = query.toString();
  return `/app/admin/learners${suffix ? `?${suffix}` : ""}`;
}
