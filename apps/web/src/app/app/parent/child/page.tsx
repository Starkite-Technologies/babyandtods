import Link from "next/link";
import type { ReactNode } from "react";
import { Baby, CalendarCheck, HeartPulse, UserCheck } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentParent } from "@/lib/parent";
import { ageFrom, apiClient, formatDate, formatTime, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Child Profile" };

export default async function ParentChild() {
  const { children, parent } = await getCurrentParent();
  const child = children[0] ?? null;
  const details = child ? await safe(apiClient.children.get(child.id), null) : null;
  const attendance = details?.attendanceRecords ?? [];
  const pickups = details?.authorizedPickups ?? [];
  const healthRecords = details?.healthRecords ?? [];
  const reports = details?.dailyReports ?? [];
  const latestAttendance = [...attendance].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <Shell crumbs={["Parent", "Child Profile"]} title="Child profile">
      {!child ? (
        <EmptyProfile />
      ) : (
        <>
          <section className="rounded-3xl border border-ink/20 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-start gap-5">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-ink text-2xl font-bold text-white">
                {child.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Linked learner</p>
                <h2 className="mt-1 text-2xl font-semibold text-ink">{child.name}</h2>
                <p className="mt-1 text-sm text-muted">{ageFrom(child.dateOfBirth)} - {child.classroom?.name ?? "Classroom not assigned"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="neutral">{child.classroom?.ageGroup ?? "Age group pending"}</Badge>
                  <Badge tone={latestAttendance?.status === "checked-in" ? "success" : latestAttendance?.status === "picked-up" ? "info" : "warning"}>
                    {latestAttendance ? attendanceText(latestAttendance.status) : "No attendance today"}
                  </Badge>
                </div>
              </div>
              <Button href="/app/parent/messages" size="sm">Contact school</Button>
            </div>
          </section>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <InfoPanel title="Parent & guardian" icon={<Baby className="h-5 w-5" />}>
              <InfoRow label="Name" value={parent?.user.name ?? "Not linked"} />
              <InfoRow label="Email" value={parent?.user.email ?? "Not linked"} />
              <InfoRow label="Phone" value={parent?.phone ?? "Not linked"} />
            </InfoPanel>

            <InfoPanel title="Today" icon={<CalendarCheck className="h-5 w-5" />}>
              <InfoRow label="Date" value={latestAttendance ? formatDate(latestAttendance.date) : "No attendance recorded"} />
              <InfoRow label="Check-in" value={formatTime(latestAttendance?.checkedInAt)} />
              <InfoRow label="Check-out" value={formatTime(latestAttendance?.checkedOutAt)} />
            </InfoPanel>

            <InfoPanel title="Pickup people" icon={<UserCheck className="h-5 w-5" />} action={<Link className="text-sm font-medium text-ink underline" href="/app/parent/pickup-people">View all</Link>}>
              {pickups.slice(0, 3).map((pickup) => (
                <div key={pickup.id} className="rounded-2xl border border-line bg-paper p-3">
                  <p className="font-semibold text-ink">{pickup.name}</p>
                  <p className="mt-1 text-sm text-muted">{pickup.relationship} - {pickup.phone}</p>
                </div>
              ))}
              {pickups.length === 0 && <p className="text-sm text-muted">No live pickup people are linked yet.</p>}
            </InfoPanel>

            <InfoPanel title="Care notes" icon={<HeartPulse className="h-5 w-5" />}>
              {healthRecords.slice(0, 3).map((record) => (
                <div key={record.id} className="rounded-2xl border border-line bg-paper p-3">
                  <p className="text-sm leading-6 text-ink">{record.notes}</p>
                  <p className="mt-1 text-xs text-muted">{formatDate(record.updatedAt)}</p>
                </div>
              ))}
              {healthRecords.length === 0 && <p className="text-sm text-muted">No live care notes are linked yet.</p>}
            </InfoPanel>
          </div>

          <section className="mt-5 rounded-3xl border border-line bg-white p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Daily reports</p>
            <div className="mt-4 space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="rounded-2xl border border-line bg-paper p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{formatDate(report.date)}</p>
                    <Badge tone={report.status === "sent" || report.status === "approved" ? "success" : "warning"}>{report.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{report.learningNote || "No learning note added."}</p>
                </div>
              ))}
              {reports.length === 0 && <p className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">No live daily reports are linked yet.</p>}
            </div>
          </section>
        </>
      )}
    </Shell>
  );
}

function EmptyProfile() {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white p-8 text-center shadow-soft">
      <Baby className="mx-auto h-9 w-9 text-muted" />
      <p className="mt-3 font-semibold text-ink">No child profile linked</p>
      <p className="mt-1 text-sm text-muted">The school office can link a learner to this parent account.</p>
    </div>
  );
}

function InfoPanel({ title, icon, children, action }: { title: string; icon: ReactNode; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">{icon}</span>
          <h3 className="font-semibold text-ink">{title}</h3>
        </div>
        {action}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line pb-2 text-sm last:border-0 last:pb-0">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}

function attendanceText(status: string) {
  if (status === "checked-in") return "At school";
  if (status === "picked-up") return "Picked up";
  return "Absent";
}
