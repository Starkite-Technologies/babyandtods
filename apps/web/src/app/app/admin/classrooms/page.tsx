import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ClassroomsPage() {
  const classrooms = await safe(apiClient.classrooms.list(), []);

  return (
    <Shell crumbs={["Admin", "Classrooms"]} title="Classrooms">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {classrooms.map((c) => {
          const count = c.children?.length ?? 0;
          const cap = 20;
          const pct = Math.round((count / cap) * 100);
          return (
            <Card key={c.id} interactive>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">{c.ageGroup}</p>
                  <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-ink">{c.name}</h3>
                </div>
                <Badge tone={pct > 90 ? "warning" : "success"}>{pct}%</Badge>
              </div>
              <p className="mt-4 text-sm text-muted">
                Lead: <span className="font-medium text-ink">{c.leadStaff?.user.name ?? "Unassigned"}</span>
              </p>
              <div className="mt-5">
                <ProgressBar value={pct} label={`${count} of ${cap} children`} />
              </div>
              <Link href="/app/admin/learners" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                View roster <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
