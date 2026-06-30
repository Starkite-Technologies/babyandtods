"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, Clock, Search, UserX } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ApiAttendance, ApiChild } from "@/lib/api";

type View = "today" | "unmarked" | "archive";

export function TeacherAttendanceBoard({ children, attendance }: { children: ApiChild[]; attendance: ApiAttendance[] }) {
  const [view, setView] = useState<View>("today");
  const [query, setQuery] = useState("");
  const attendanceByChild = useMemo(() => new Map(attendance.map((item) => [item.childId, item])), [attendance]);
  const unmarked = children.filter((child) => !attendanceByChild.has(child.id));
  const present = attendance.filter((item) => item.status === "checked-in" || item.status === "picked-up");
  const absent = attendance.filter((item) => item.status === "absent");

  const queue = (view === "unmarked" ? unmarked : children).filter((child) =>
    `${child.name} ${child.parent?.user?.name ?? ""} ${child.classroom?.name ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-line bg-ink p-5 text-white shadow-soft">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Attendance cockpit</p>
            <h2 className="mt-2 text-2xl font-semibold">Mark the day without opening the archive.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Work from the action queue first. Historical records stay behind the archive layer.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <Pulse label="Present" value={present.length} />
            <Pulse label="Absent" value={absent.length} />
            <Pulse label="Unmarked" value={unmarked.length} />
          </div>
        </div>
      </section>

      <div className="rounded-3xl border border-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              ["today", "Today board"],
              ["unmarked", "Action queue"],
              ["archive", "Record archive"]
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setView(key as View)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${view === key ? "bg-ink text-white" : "border border-line bg-white text-ink hover:bg-ink-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
          {view !== "archive" && (
            <label className="relative block min-w-0 lg:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find learner"
                className="h-11 w-full rounded-full border border-line bg-white pl-9 pr-4 text-sm outline-none focus:border-brand-blue"
              />
            </label>
          )}
        </div>

        {view === "archive" ? (
          <details className="mt-4 rounded-2xl border border-line bg-paper p-4">
            <summary className="cursor-pointer text-sm font-semibold text-ink">Open attendance records</summary>
            <div className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-line bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-ink-50 text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Learner</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Check-in</th>
                    <th className="px-4 py-3">Check-out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {attendance.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-muted">{new Date(item.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3 font-medium text-ink">{item.child?.name ?? "Learner"}</td>
                      <td className="px-4 py-3"><AttendanceBadge status={item.status} /></td>
                      <td className="px-4 py-3 text-muted">{item.checkedInAt ? new Date(item.checkedInAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                      <td className="px-4 py-3 text-muted">{item.checkedOutAt ? new Date(item.checkedOutAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {queue.map((child) => {
              const record = attendanceByChild.get(child.id);
              return (
                <div key={child.id} className="rounded-2xl border border-line bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{child.name}</p>
                      <p className="text-xs text-muted">{child.classroom?.name ?? "No classroom"} · {child.parent?.user?.name ?? "No parent"}</p>
                    </div>
                    <AttendanceBadge status={record?.status ?? "unmarked"} />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Action icon={<CheckCircle2 className="h-4 w-4" />} label="Present" />
                    <Action icon={<Clock className="h-4 w-4" />} label="Late" />
                    <Action icon={<UserX className="h-4 w-4" />} label="Absent" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Pulse({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-white/60">{label}</p>
    </div>
  );
}

function AttendanceBadge({ status }: { status: string }) {
  const tone = status === "checked-in" ? "success" : status === "absent" ? "danger" : status === "picked-up" ? "info" : "warning";
  return <Badge tone={tone}>{status.replace("-", " ")}</Badge>;
}

function Action({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-paper px-2 py-2 text-xs font-medium text-ink transition hover:border-brand-blue hover:bg-white">
      {icon}
      {label}
    </button>
  );
}
