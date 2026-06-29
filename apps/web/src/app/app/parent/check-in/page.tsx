import { Shell } from "@/components/dashboard/Shell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { Timeline } from "@/components/ui/Timeline";
import { apiClient, safe } from "@/lib/api";
import { Bell, QrCode, ShieldCheck, UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CheckInPage() {
  const children = await safe(apiClient.children.list(), []);
  const child = children[0];
  const pickups = child ? await safe(apiClient.authorizedPickups.forChild(child.id), []) : [];

  return (
    <Shell crumbs={["Parent", "Live Pass"]} title="Live pickup pass">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card
          title="Pickup pass"
          description="Refreshable QR access for verified guardians."
          action={<Badge tone="success"><ShieldCheck className="h-3.5 w-3.5" /> Verified</Badge>}
          className="border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(110,148,176,0.2),rgba(241,222,184,0.42))] shadow-lift backdrop-blur-xl"
        >
          <div className="mx-auto flex aspect-square max-w-[280px] flex-col items-center justify-center rounded-[2rem] border border-white/80 bg-white/70 p-6 text-center shadow-lift">
            <QrCode className="mb-4 h-8 w-8 text-ink" />
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 49 }).map((_, i) => (
                <span key={i} className={`h-4 w-4 rounded-sm ${i % 3 === 0 || i % 5 === 0 ? "bg-ink" : "bg-ink-100"}`} />
              ))}
            </div>
            <p className="mt-4 font-mono text-xs text-muted">{(child?.name ?? "PASS").toUpperCase().slice(0, 12)}-{new Date().getDate().toString().padStart(2, "0")}</p>
            <p className="mt-1 text-xs text-muted">Show at the front desk</p>
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button className="w-full" variant="secondary">
              <QrCode className="h-4 w-4" />
              Refresh pass
            </Button>
            <Button className="w-full" variant="outline">
              <Bell className="h-4 w-4" />
              Notify desk
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Today's plan">
            <Timeline
              items={[
                { time: "08:12", title: "Checked in", detail: "Sunshine class · Maria Shikongo handed over." },
                { time: "15:30", title: "Planned pickup", detail: "Daniel Shikongo authorized for collection." }
              ]}
            />
          </Card>
          <Card
            title="Authorized pickup people"
            description="Only approved contacts can use pickup passes."
            className="border-white/70 bg-white/75 backdrop-blur-xl"
          >
            <DataTable
              columns={["Name", "Relationship", "Phone"]}
              rows={pickups.map((p) => [p.name, p.relationship, p.phone])}
              empty="No pickup contacts yet."
            />
            <Button className="mt-4 w-full" variant="secondary">
              <UserPlus className="h-4 w-4" />
              Request pickup contact
            </Button>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
