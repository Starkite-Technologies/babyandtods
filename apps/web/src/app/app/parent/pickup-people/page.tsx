import { Info, UserCheck } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentParent } from "@/lib/parent";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Pickup People" };

export default async function ParentPickupPeople() {
  const { children } = await getCurrentParent();
  const pickupGroups = await Promise.all(
    children.map(async (child) => ({
      child,
      pickups: await safe(apiClient.authorizedPickups.forChild(child.id), [])
    }))
  );
  const total = pickupGroups.reduce((sum, group) => sum + group.pickups.length, 0);

  return (
    <Shell crumbs={["Parent", "Pickup People"]} title="Pickup people">
      <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
        <p className="flex items-start gap-2 text-sm leading-6 text-blue-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Pickup changes are controlled by the academy office. Message the school to add, remove, or update an authorised person.
        </p>
      </div>

      <section className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Live pickup access</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{total} authorised person{total === 1 ? "" : "s"}</h2>
          </div>
          <Button href="/app/parent/messages" size="sm"><UserCheck className="h-4 w-4" /> Request change</Button>
        </div>

        <div className="mt-5 space-y-5">
          {pickupGroups.map((group) => (
            <div key={group.child.id}>
              <p className="mb-3 font-semibold text-ink">{group.child.name}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {group.pickups.map((person) => (
                  <div key={person.id} className="rounded-2xl border border-line bg-paper p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink font-semibold text-white">
                        {person.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{person.name}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge tone="neutral">{person.relationship}</Badge>
                          <Badge tone="success">Authorised</Badge>
                        </div>
                        <p className="mt-2 text-sm text-muted">{person.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {group.pickups.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">No pickup people are linked to {group.child.name} yet.</p>
                )}
              </div>
            </div>
          ))}
          {pickupGroups.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">No linked learner profile found for this parent account.</p>
          )}
        </div>
      </section>
    </Shell>
  );
}
