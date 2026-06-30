import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, ClipboardList, MessageCircle, Search, Sparkles, Users } from "lucide-react";
import { Shell } from "@/components/dashboard/Shell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentUser } from "@/lib/auth";
import { apiClient, safe } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Teacher Dashboard" };

export default async function TeacherDashboard() {
  const [user, children, attendance, reports, messages, announcements, healthRecords] = await Promise.all([
    getCurrentUser(),
    safe(apiClient.children.list(), []),
    safe(apiClient.attendance.today(), []),
    safe(apiClient.dailyReports.recent(), []),
    safe(apiClient.messages.list(), []),
    safe(apiClient.announcements.list("teachers"), []),
    safe(apiClient.healthRecords.list(), [])
  ]);

  const attendanceByChild = new Map(attendance.map((item) => [item.childId, item]));
  const present = attendance.filter((item) => item.status === "checked-in" || item.status === "picked-up").length;
  const unmarked = children.filter((child) => !attendanceByChild.has(child.id)).length;
  const today = new Date().toISOString().slice(0, 10);
  const reportsToday = new Set(reports.filter((report) => report.date?.slice(0, 10) === today).map((report) => report.childId)).size;
  const activeNotes = healthRecords.length;
  const teacherName = user?.name ?? "Teacher";

  return (
    <Shell
      crumbs={["Teacher", "Dashboard"]}
      title="Teacher workspace"
      action={<Button href="/app/teacher/messages" size="sm"><MessageCircle className="h-4 w-4" /> Communication</Button>}
    >
      <section className="teacher-welcome-panel relative overflow-hidden rounded-3xl border border-ink/20 bg-white shadow-soft">
        <div className="absolute inset-x-0 top-0 h-2 bg-ink" aria-hidden />
        <div className="absolute inset-x-10 top-2 h-1 rounded-b-full bg-rainbow" aria-hidden />
        <div className="absolute bottom-0 left-0 top-0 hidden w-2 bg-ink lg:block" aria-hidden />
        <div className="absolute bottom-0 right-0 top-0 hidden w-2 bg-ink lg:block" aria-hidden />
        <div className="teacher-orbit absolute -right-8 -top-8 hidden h-40 w-40 lg:block" aria-hidden>
          <span className="orbit-ring" />
          <span className="orbit-dot orbit-dot-blue" />
          <span className="orbit-dot orbit-dot-pink" />
          <span className="orbit-dot orbit-dot-green" />
          <span className="orbit-dot orbit-dot-yellow" />
        </div>

        <div className="grid gap-5 p-5 pt-8 lg:grid-cols-[1fr_390px] lg:p-8">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2 shadow-sm">
              <span className="welcome-spark relative h-10 w-10 shrink-0 rounded-2xl bg-rainbow" aria-hidden />
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">Today at Babies and Todd's</span>
                <span className="block text-base font-semibold text-ink">Welcome back, {teacherName}</span>
              </span>
            </div>

            <div className="mt-5 grid max-w-3xl gap-3 sm:grid-cols-3">
              <FlowStep href="/app/teacher/attendance" icon={<CalendarCheck className="h-5 w-5" />} title="Mark arrival" detail={`${unmarked} waiting`} />
              <FlowStep href="/app/teacher/my-class" icon={<Users className="h-5 w-5" />} title="Open profiles" detail={`${children.length} learners`} />
              <FlowStep href="/app/teacher/daily-reports" icon={<ClipboardList className="h-5 w-5" />} title="Write reports" detail={`${reportsToday}/${children.length} done`} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button href="/app/teacher/messages" size="sm"><MessageCircle className="h-4 w-4" /> Communication</Button>
              <Button href="/app/teacher/attendance" size="sm" variant="secondary"><CalendarCheck className="h-4 w-4" /> Attendance</Button>
              <Button href="/app/teacher/my-class" size="sm" variant="secondary"><Users className="h-4 w-4" /> Class</Button>
            </div>
          </div>

          <div className="relative z-10 rounded-3xl border border-line bg-paper/80 p-3">
            <div className="mb-2 flex items-center justify-between px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Room pulse</p>
              <span className="h-2.5 w-2.5 rounded-full bg-brand-green shadow-[0_0_0_5px_rgba(88,201,0,0.12)]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Signal label="Learners" value={children.length} />
              <Signal label="Present" value={present} />
              <Signal label="Unmarked" value={unmarked} warn={unmarked > 0} />
              <Signal label="Reports" value={`${reportsToday}/${children.length}`} />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">Today queue</p>
              <h3 className="mt-1 text-lg font-semibold text-ink">Action layers</h3>
            </div>
            <Search className="h-5 w-5 text-muted" />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <ActionLayer
              href="/app/teacher/attendance"
              icon={<CalendarCheck className="h-5 w-5" />}
              title="Attendance"
              detail={unmarked > 0 ? `${unmarked} learners still need a mark` : "All available records are marked"}
              tone={unmarked > 0 ? "warning" : "success"}
            />
            <ActionLayer
              href="/app/teacher/daily-reports"
              icon={<Sparkles className="h-5 w-5" />}
              title="Daily reports"
              detail={`${Math.max(children.length - reportsToday, 0)} reports left for today`}
              tone={reportsToday >= children.length && children.length > 0 ? "success" : "warning"}
            />
            <ActionLayer
              href="/app/teacher/my-class"
              icon={<Users className="h-5 w-5" />}
              title="Learner profiles"
              detail={`${activeNotes} live care note${activeNotes === 1 ? "" : "s"} attached`}
              tone={activeNotes > 0 ? "danger" : "neutral"}
            />
            <ActionLayer
              href="/app/teacher/messages"
              icon={<MessageCircle className="h-5 w-5" />}
              title="Communication"
              detail={`${messages.length} messages - ${announcements.length} announcements`}
              tone="info"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-line bg-white p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Latest communication</p>
          <div className="mt-4 space-y-3">
            {announcements.slice(0, 3).map((item) => (
              <Link key={item.id} href="/app/teacher/messages" className="block rounded-2xl border border-line bg-paper p-4 transition hover:border-brand-blue/40">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-ink">{item.title}</p>
                  <Badge tone={item.audience === "all" ? "neutral" : "info"}>{item.audience}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.body}</p>
              </Link>
            ))}
            {announcements.length === 0 && <p className="rounded-2xl border border-dashed border-line p-5 text-sm text-muted">No live announcements yet.</p>}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Signal({ label, value, warn }: { label: string; value: number | string; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <p className={`text-2xl font-semibold ${warn ? "text-amber-700" : "text-ink"}`}>{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

function FlowStep({ href, icon, title, detail }: { href: string; icon: ReactNode; title: string; detail: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-blue/50 hover:shadow-soft">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white transition group-hover:bg-brand-blue">{icon}</span>
      <span className="mt-3 block font-semibold text-ink">{title}</span>
      <span className="mt-1 block text-sm text-muted">{detail}</span>
    </Link>
  );
}

function ActionLayer({
  href,
  icon,
  title,
  detail,
  tone
}: {
  href: string;
  icon: ReactNode;
  title: string;
  detail: string;
  tone: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <Link href={href} className="rounded-2xl border border-line bg-white p-4 transition hover:border-brand-blue/50 hover:shadow-soft">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white">{icon}</span>
        <span>
          <span className="font-semibold text-ink">{title}</span>
          <span className="mt-1 block text-sm leading-5 text-muted">{detail}</span>
          <Badge className="mt-3" tone={tone}>Open layer</Badge>
        </span>
      </div>
    </Link>
  );
}
