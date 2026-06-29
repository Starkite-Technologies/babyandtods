import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const [staff, classrooms] = await Promise.all([
    safe(apiClient.staff.list(), []),
    safe(apiClient.classrooms.list(), [])
  ]);

  const leadTeachers = staff.filter((s) =>
    classrooms.some((c) => c.leadStaff?.id === s.id)
  );
  const assistants = staff.filter(
    (s) => !classrooms.some((c) => c.leadStaff?.id === s.id)
  );

  // Group staff by classroom
  const classroomLeads = classrooms
    .filter((c) => c.leadStaff)
    .map((c) => ({ classroom: c.name, ageGroup: c.ageGroup, staff: c.leadStaff! }));

  const unassigned = staff.filter(
    (s) => !classrooms.some((c) => c.leadStaff?.id === s.id)
  );

  return (
    <Shell
      crumbs={["Admin", "Staff"]}
      title={`Staff · ${staff.length} members`}
      action={<Button size="sm">+ Add staff</Button>}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total staff" value={staff.length} detail="All roles" />
        <StatCard label="Lead teachers" value={leadTeachers.length} detail="Classroom assigned" />
        <StatCard label="Support staff" value={assistants.length} detail="Other roles" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Classroom assignments */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-ink">Classroom assignments</h2>
          {classroomLeads.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-line">
              <p className="text-sm text-muted">No classroom leads assigned.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {classroomLeads.map(({ classroom, ageGroup, staff: s }) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper">
                    {s.user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink truncate">{s.user.name}</p>
                    <p className="text-xs text-muted">{s.roleTitle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-ink">{classroom}</p>
                    <p className="text-xs text-muted">{ageGroup}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* All staff */}
        <section>
          <h2 className="mb-3 text-sm font-semibold text-ink">Full directory</h2>
          {staff.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl border border-dashed border-line">
              <p className="text-sm text-muted">No staff members found.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map((s) => {
                const classroom = classrooms.find((c) => c.leadStaff?.id === s.id);
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-50 font-display text-sm font-bold text-ink">
                      {s.user.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{s.user.name}</p>
                      <p className="text-xs text-muted truncate">{s.user.email}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <Badge tone={classroom ? "success" : "neutral"}>
                        {classroom ? classroom.name : "Unassigned"}
                      </Badge>
                      <p className="text-[11px] text-muted">{s.roleTitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {unassigned.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            {unassigned.length} staff member{unassigned.length > 1 ? "s" : ""} not assigned to a classroom
          </p>
          <p className="mt-0.5 text-xs text-amber-700">
            {unassigned.map((s) => s.user.name).join(", ")}
          </p>
        </div>
      )}
    </Shell>
  );
}
