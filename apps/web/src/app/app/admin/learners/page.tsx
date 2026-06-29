import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { apiClient, ageFrom, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function AdminLearnersPage() {
  const [children, attendance, allergies] = await Promise.all([
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.allergies.list(), [])
  ]);

  const attendanceMap = Object.fromEntries(attendance.map((a) => [a.childId, a]));
  const allergyMap: Record<string, typeof allergies> = {};
  for (const a of allergies) {
    allergyMap[a.childId] = [...(allergyMap[a.childId] ?? []), a];
  }

  // Group by classroom
  const byClass: Record<string, typeof children> = {};
  for (const c of children) {
    const key = c.classroom?.name ?? "Unassigned";
    byClass[key] = [...(byClass[key] ?? []), c];
  }

  return (
    <Shell
      crumbs={["Admin", "Learners"]}
      title={`Learners · ${children.length} enrolled`}
      action={<Button size="sm">+ Add learner</Button>}
    >
      {children.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-line">
          <p className="text-sm text-muted">No learners enrolled yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(byClass).map(([className, kids]) => (
            <section key={className}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-sm font-semibold text-ink">{className}</h2>
                <span className="rounded-full bg-ink-50 px-2 py-0.5 text-[11px] font-medium text-muted">
                  {kids.length}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {kids.map((child) => {
                  const att = attendanceMap[child.id];
                  const childAllergies = allergyMap[child.id] ?? [];
                  const hasSevere = childAllergies.some((a) => a.severity === "severe");

                  return (
                    <div
                      key={child.id}
                      className="group relative overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-ink-200 hover:shadow-sm"
                    >
                      {hasSevere && (
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500" />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper">
                              {child.name[0]}
                            </div>
                            <div>
                              <p className="font-medium text-ink">{child.name}</p>
                              <p className="text-xs text-muted">{ageFrom(child.dateOfBirth)}</p>
                            </div>
                          </div>
                          {att && (
                            <Badge
                              tone={
                                att.status === "checked-in"
                                  ? "success"
                                  : att.status === "absent"
                                  ? "warning"
                                  : "neutral"
                              }
                            >
                              {att.status === "checked-in"
                                ? "Present"
                                : att.status === "absent"
                                ? "Absent"
                                : "Picked up"}
                            </Badge>
                          )}
                        </div>

                        {childAllergies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {childAllergies.map((a) => (
                              <span
                                key={a.id}
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                                  a.severity === "severe"
                                    ? "bg-red-50 text-red-700"
                                    : a.severity === "moderate"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {a.allergen}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                          <p className="text-xs text-muted">
                            {child.parent?.user?.name ?? "No parent linked"}
                          </p>
                          <p className="text-xs text-muted">
                            {child.classroom?.ageGroup ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </Shell>
  );
}
