import { CalendarCheck } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { getCurrentParent } from "@/lib/parent";
import { apiClient, formatDate, formatTime, safe, type ApiAttendance } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Attendance" };

export default async function ParentAttendance() {
  const { children } = await getCurrentParent();
  const childIds = new Set(children.map((child) => child.id));
  const records = (await Promise.all(children.map((child) => safe(apiClient.attendance.forChild(child.id), []))))
    .flat()
    .filter((record) => childIds.has(record.childId))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const present = records.filter((record) => record.status === "checked-in" || record.status === "picked-up").length;
  const absent = records.filter((record) => record.status === "absent").length;
  const rate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;

  return (
    <Shell crumbs={["Parent", "Attendance"]} title="Attendance">
      <section className="rounded-3xl border border-ink/20 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Live attendance</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">{rate}% attendance rate</h2>
            <p className="mt-1 text-sm text-muted">{records.length} live record{records.length === 1 ? "" : "s"} linked to this parent account.</p>
          </div>
          <div className="flex gap-2">
            <Badge tone="success">{present} present</Badge>
            <Badge tone={absent > 0 ? "danger" : "neutral"}>{absent} absent</Badge>
          </div>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-green" style={{ width: `${rate}%` }} />
        </div>
      </section>

      <section className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">History</p>
            <h3 className="mt-1 text-lg font-semibold text-ink">Recent records</h3>
          </div>
          <CalendarCheck className="h-5 w-5 text-muted" />
        </div>
        <div className="mt-4 space-y-3">
          {records.map((record) => (
            <AttendanceRow key={record.id} record={record} />
          ))}
          {records.length === 0 && (
            <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">No live attendance records are linked to this parent account yet.</p>
          )}
        </div>
      </section>
    </Shell>
  );
}

function AttendanceRow({ record }: { record: ApiAttendance }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-line bg-paper p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
      <div>
        <p className="font-semibold text-ink">{record.child?.name ?? "Linked learner"}</p>
        <p className="mt-1 text-sm text-muted">{formatDate(record.date)}</p>
      </div>
      <div className="text-sm text-muted">
        {record.checkedInAt && <span>In {formatTime(record.checkedInAt)}</span>}
        {record.checkedOutAt && <span className="ml-3">Out {formatTime(record.checkedOutAt)}</span>}
        {!record.checkedInAt && !record.checkedOutAt && <span>No time recorded</span>}
      </div>
      <Badge tone={record.status === "checked-in" ? "success" : record.status === "picked-up" ? "info" : "danger"}>
        {record.status === "checked-in" ? "At school" : record.status === "picked-up" ? "Picked up" : "Absent"}
      </Badge>
    </div>
  );
}
