"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Search, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ApiAttendance, ApiChild, ApiHealthRecord } from "@/lib/api";

type Filter = "all" | "present" | "unmarked" | "notes";

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export function TeacherLearnerDirectory({
  children,
  attendance,
  healthRecords,
  pageSize = 12
}: {
  children: ApiChild[];
  attendance: ApiAttendance[];
  healthRecords: ApiHealthRecord[];
  pageSize?: number;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(children[0]?.id ?? "");

  const attendanceByChild = useMemo(() => new Map(attendance.map((item) => [item.childId, item])), [attendance]);
  const notesByChild = useMemo(() => {
    const map = new Map<string, ApiHealthRecord[]>();
    for (const record of healthRecords) map.set(record.childId, [...(map.get(record.childId) ?? []), record]);
    return map;
  }, [healthRecords]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return children.filter((child) => {
      const record = attendanceByChild.get(child.id);
      const notes = notesByChild.get(child.id) ?? [];
      const matchesQuery = !needle || `${child.name} ${child.parent?.user?.name ?? ""} ${child.classroom?.name ?? ""}`.toLowerCase().includes(needle);
      const matchesFilter =
        filter === "all" ||
        (filter === "present" && (record?.status === "checked-in" || record?.status === "picked-up")) ||
        (filter === "unmarked" && !record) ||
        (filter === "notes" && notes.length > 0);
      return matchesQuery && matchesFilter;
    });
  }, [attendanceByChild, children, filter, notesByChild, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selected = children.find((child) => child.id === selectedId) ?? visible[0] ?? children[0];
  const selectedRecord = selected ? attendanceByChild.get(selected.id) : undefined;
  const selectedNotes = selected ? notesByChild.get(selected.id) ?? [] : [];

  function chooseFilter(next: Filter) {
    setFilter(next);
    setPage(1);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <section className="rounded-3xl border border-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search learner, parent, or classroom"
              className="h-11 w-full rounded-full border border-line bg-white pl-9 pr-4 text-sm text-ink outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              ["all", "All"],
              ["present", "Present"],
              ["unmarked", "Unmarked"],
              ["notes", "Notes"]
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => chooseFilter(key as Filter)}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${filter === key ? "bg-ink text-white" : "border border-line bg-white text-ink hover:bg-ink-50"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((child) => {
            const record = attendanceByChild.get(child.id);
            const notes = notesByChild.get(child.id) ?? [];
            return (
              <button
                key={child.id}
                onClick={() => setSelectedId(child.id)}
                className={`rounded-2xl border p-4 text-left transition ${selected?.id === child.id ? "border-ink bg-ink-50" : "border-line bg-white hover:border-brand-blue/40"}`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ink text-sm font-bold text-white">
                    {initials(child.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink">{child.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{child.classroom?.name ?? "No classroom"}</span>
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone={record ? (record.status === "checked-in" ? "success" : record.status === "absent" ? "danger" : "info") : "warning"}>
                    {record?.status?.replace("-", " ") ?? "unmarked"}
                  </Badge>
                  {notes.length > 0 && <Badge tone="warning">{notes.length} note{notes.length > 1 ? "s" : ""}</Badge>}
                </div>
              </button>
            );
          })}
        </div>

        {visible.length === 0 && (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-paper p-8 text-center text-sm text-muted">
            No learners match this view.
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing {visible.length} of {filtered.length} learners. Page {safePage} / {totalPages}.
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
            <Button size="sm" variant="secondary" disabled={safePage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button>
          </div>
        </div>
      </section>

      <aside className="rounded-3xl border border-line bg-white p-5 shadow-soft xl:sticky xl:top-24 xl:self-start">
        {selected ? (
          <>
            <div className="flex items-start gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink font-display text-lg font-bold text-white">
                {initials(selected.name)}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink">{selected.name}</p>
                <p className="text-sm text-muted">{selected.classroom?.name ?? "No classroom"}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-2 text-sm">
              <Info label="Parent" value={selected.parent?.user?.name ?? "Not linked"} />
              <Info label="Phone" value={selected.parent?.phone ?? "Not linked"} />
              <Info label="Attendance" value={selectedRecord?.status?.replace("-", " ") ?? "Unmarked today"} />
              <Info label="Date of birth" value={selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString("en-GB") : "Not recorded"} />
            </dl>
            <div className="mt-5 space-y-2">
              <Button className="w-full" href={`/app/teacher/learners?learner=${selected.id}`} variant="secondary">
                <UserCircle className="h-4 w-4" />
                Open profile
              </Button>
              <Button className="w-full" href={`/app/teacher/messages?learner=${selected.id}`}>
                <MessageCircle className="h-4 w-4" />
                Message family
              </Button>
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Care notes</p>
              {selectedNotes.length === 0 ? (
                <p className="mt-2 text-sm text-muted">No active notes recorded.</p>
              ) : (
                <div className="mt-2 space-y-2">
                  {selectedNotes.slice(0, 3).map((note) => (
                    <p key={note.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      {note.notes}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">No learners available.</p>
        )}
      </aside>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 rounded-2xl border border-line bg-white px-3 py-2">
      <dt className="text-muted">{label}</dt>
      <dd className="truncate font-medium text-ink">{value}</dd>
    </div>
  );
}
