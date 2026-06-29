"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, LogIn, LogOut, UserX, ScanLine } from "lucide-react";
import { checkInAction } from "@/lib/actions";
import { toast } from "@/components/ui/Toast";

type Status = "checked-in" | "picked-up" | "absent" | "out";

export type RosterChild = {
  childId: string;
  name: string;
  classroom: string;
  status: Status;
  checkedInAt?: string | null;
};

const statusMeta: Record<Status, { label: string; dot: string; chip: string }> = {
  "checked-in": { label: "Present", dot: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200/60" },
  "picked-up": { label: "Picked up", dot: "bg-sky", chip: "bg-blue-50 text-blue-700 ring-blue-200/60" },
  absent: { label: "Absent", dot: "bg-amber-500", chip: "bg-amber-50 text-amber-800 ring-amber-200/60" },
  out: { label: "Not in", dot: "bg-ink-300", chip: "bg-ink-50 text-ink-500 ring-ink-200/60" }
};

const filters: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "checked-in", label: "Present" },
  { key: "picked-up", label: "Picked up" },
  { key: "absent", label: "Absent" },
  { key: "out", label: "Not in" }
];

export function CheckInBoard({
  initial,
  kioscoCode,
  qrDataUrl
}: {
  initial: RosterChild[];
  kioscoCode: string;
  qrDataUrl: string | null;
}) {
  const [roster, setRoster] = useState<RosterChild[]>(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [, startTransition] = useTransition();

  const counts = useMemo(() => {
    return {
      present: roster.filter((r) => r.status === "checked-in").length,
      out: roster.filter((r) => r.status === "picked-up").length,
      absent: roster.filter((r) => r.status === "absent").length,
      total: roster.length
    };
  }, [roster]);

  const visible = roster.filter((r) => {
    const matchQ = r.name.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "all" || r.status === filter;
    return matchQ && matchF;
  });

  function setStatus(child: RosterChild, status: Status) {
    setRoster((prev) =>
      prev.map((r) =>
        r.childId === child.childId
          ? { ...r, status, checkedInAt: status === "checked-in" ? new Date().toISOString() : r.checkedInAt }
          : r
      )
    );
    toast(
      `${child.name.split(" ")[0]} · ${statusMeta[status].label}`,
      status === "checked-in" ? "success" : status === "absent" ? "danger" : "info"
    );
    if (status !== "out") {
      startTransition(async () => {
        await checkInAction({ childId: child.childId, status });
      });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      {/* Roster */}
      <div className="glass rounded-2xl p-5 sm:p-6">
        {/* Live header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-inset ring-emerald-200/60">
              <span className="pulse-dot relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 text-emerald-500" />
              Live
            </span>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-ink">{counts.present} present</span>
              <span className="text-muted">{counts.out} out</span>
              <span className="text-muted">{counts.absent} absent</span>
            </div>
          </div>
          <label className="flex h-10 items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 text-sm text-ink-500 backdrop-blur focus-within:border-accent">
            <Search className="h-4 w-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-40 bg-transparent outline-none placeholder:text-ink-400"
              placeholder="Find learner…"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                filter === f.key ? "bg-ink text-paper" : "bg-white/50 text-ink-600 hover:bg-white/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        {visible.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted">No learners match.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {visible.map((child) => {
              const meta = statusMeta[child.status];
              return (
                <div key={child.childId} className="glass-strong animate-rise rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm text-paper">
                        {child.name[0]}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${meta.dot}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{child.name}</p>
                      <p className="text-xs text-muted">{child.classroom}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${meta.chip}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    <ActionBtn
                      active={child.status === "checked-in"}
                      onClick={() => setStatus(child, "checked-in")}
                      icon={<LogIn className="h-3.5 w-3.5" />}
                      label="In"
                      tone="emerald"
                    />
                    <ActionBtn
                      active={child.status === "picked-up"}
                      onClick={() => setStatus(child, "picked-up")}
                      icon={<LogOut className="h-3.5 w-3.5" />}
                      label="Out"
                      tone="sky"
                    />
                    <ActionBtn
                      active={child.status === "absent"}
                      onClick={() => setStatus(child, "absent")}
                      icon={<UserX className="h-3.5 w-3.5" />}
                      label="Absent"
                      tone="amber"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Kiosk panel */}
      <div className="glass-dark glass-accent-top h-fit rounded-2xl p-6 text-paper">
        <div className="flex items-center gap-2 text-paper/70">
          <ScanLine className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em]">Kiosk check-in</span>
        </div>
        <p className="mt-2 text-sm text-paper/60">Parents scan at the door, or enter today's code.</p>

        <div className="mt-5 flex justify-center">
          {qrDataUrl ? (
            <div className="rounded-2xl bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="Check-in QR code" className="h-44 w-44" />
            </div>
          ) : (
            <div className="grid h-44 w-44 grid-cols-7 gap-1 rounded-2xl bg-white p-3">
              {Array.from({ length: 49 }).map((_, i) => (
                <span
                  key={i}
                  className={`rounded-[2px] ${[0, 1, 7, 8, 5, 6, 12, 13, 36, 42, 43, 48, 24, 17, 31].includes(i) ? "bg-ink" : "bg-white"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl bg-white/5 p-4 text-center ring-1 ring-inset ring-white/10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-paper/50">Today's code</p>
          <p className="mt-1 font-mono text-3xl font-semibold tracking-[0.3em] text-paper">{kioscoCode}</p>
        </div>

        <ul className="mt-5 space-y-2 text-xs text-paper/60">
          <li>1 · Parent opens the family app at drop-off</li>
          <li>2 · Scans this code or types it in</li>
          <li>3 · Roster updates here instantly</li>
        </ul>
      </div>
    </div>
  );
}

function ActionBtn({
  active,
  onClick,
  icon,
  label,
  tone
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  tone: "emerald" | "sky" | "amber";
}) {
  const activeCls =
    tone === "emerald"
      ? "bg-emerald-500 text-white"
      : tone === "sky"
      ? "bg-sky text-white"
      : "bg-amber-500 text-white";
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-medium transition ${
        active ? activeCls : "bg-white/60 text-ink-600 hover:bg-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
