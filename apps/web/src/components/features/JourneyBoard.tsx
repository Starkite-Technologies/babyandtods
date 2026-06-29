"use client";

import { useMemo, useState } from "react";
import { Heart, Plus, Check, Sparkles, Star } from "lucide-react";
import { toast } from "@/components/ui/Toast";

type Moment = { id: string; note: string; date: string; liked: boolean };
type Milestone = { id: string; label: string; area: string; done: boolean; date?: string };

const seedMilestones: Milestone[] = [
  { id: "m1", label: "Says 20+ words", area: "Language", done: true, date: "2026-05-12" },
  { id: "m2", label: "Counts to ten", area: "Numeracy", done: true, date: "2026-06-02" },
  { id: "m3", label: "Builds a 6-block tower", area: "Motor", done: true, date: "2026-06-18" },
  { id: "m4", label: "Shares toys with friends", area: "Social", done: false },
  { id: "m5", label: "Recognises own name", area: "Literacy", done: false },
  { id: "m6", label: "Puts on own shoes", area: "Independence", done: false }
];

const areaColor: Record<string, string> = {
  Language: "bg-accent-50 text-accent-700 ring-accent-200/60",
  Numeracy: "bg-blue-50 text-blue-700 ring-blue-200/60",
  Motor: "bg-emerald-50 text-emerald-700 ring-emerald-200/60",
  Social: "bg-amber-50 text-amber-800 ring-amber-200/60",
  Literacy: "bg-accent-50 text-accent-700 ring-accent-200/60",
  Independence: "bg-ink-50 text-ink-700 ring-ink-200/60"
};

const tints = [
  "from-accent-100 to-sand",
  "from-blue-100 to-emerald-50",
  "from-amber-50 to-accent-100",
  "from-emerald-50 to-blue-100"
];

export function JourneyBoard({ childName, moments: seedMoments }: { childName: string; moments: Moment[] }) {
  const [milestones, setMilestones] = useState<Milestone[]>(seedMilestones);
  const [moments, setMoments] = useState<Moment[]>(seedMoments);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const first = childName.split(" ")[0];
  const achieved = milestones.filter((m) => m.done).length;
  const pct = Math.round((achieved / milestones.length) * 100);

  const ring = useMemo(() => {
    const r = 34;
    const c = 2 * Math.PI * r;
    return { r, c, offset: c - (pct / 100) * c };
  }, [pct]);

  function toggleMilestone(id: string) {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const done = !m.done;
        if (done) toast(`Milestone unlocked · ${m.label}`, "accent");
        return { ...m, done, date: done ? new Date().toISOString() : undefined };
      })
    );
  }

  function like(id: string) {
    setMoments((prev) => prev.map((m) => (m.id === id ? { ...m, liked: !m.liked } : m)));
  }

  function addMilestone() {
    if (!newLabel.trim()) return;
    setMilestones((prev) => [...prev, { id: `m-${Date.now()}`, label: newLabel.trim(), area: "Custom", done: false }]);
    setNewLabel("");
    setAdding(false);
    toast("Milestone added to the journey", "success");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      {/* Milestones */}
      <div className="glass glass-accent-top h-fit rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative h-[84px] w-[84px] shrink-0">
            <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
              <circle cx="42" cy="42" r={ring.r} fill="none" stroke="#EFEFED" strokeWidth="8" />
              <circle
                cx="42"
                cy="42"
                r={ring.r}
                fill="none"
                stroke="#D85B2B"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={ring.c}
                strokeDashoffset={ring.offset}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-lg font-medium text-ink">{pct}%</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Development milestones</h3>
            <p className="text-xs text-muted">
              {first} has reached {achieved} of {milestones.length}
            </p>
          </div>
        </div>

        <ul className="mt-5 space-y-2">
          {milestones.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => toggleMilestone(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                  m.done ? "bg-white/60" : "bg-white/30 hover:bg-white/50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    m.done ? "border-accent bg-accent text-white" : "border-ink-200 text-transparent"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1">
                  <span className={`block text-sm font-medium ${m.done ? "text-ink" : "text-ink-600"}`}>{m.label}</span>
                  {m.done && m.date && (
                    <span className="text-[11px] text-muted">
                      {new Date(m.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  )}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${areaColor[m.area] ?? "bg-ink-50 text-ink-600 ring-ink-200/60"}`}>
                  {m.area}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {adding ? (
          <div className="mt-3 flex gap-2">
            <input
              autoFocus
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addMilestone()}
              placeholder="New milestone…"
              className="h-10 flex-1 rounded-xl border border-white/60 bg-white/60 px-3 text-sm outline-none focus:border-accent"
            />
            <button onClick={addMilestone} className="rounded-xl bg-ink px-4 text-sm font-medium text-paper">
              Add
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-200 py-2.5 text-sm font-medium text-ink-500 transition hover:border-accent hover:text-accent"
          >
            <Plus className="h-4 w-4" /> Add milestone
          </button>
        )}
      </div>

      {/* Moments feed */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-ink">Moments from the classroom</h3>
        </div>

        {moments.length === 0 ? (
          <div className="glass flex h-48 items-center justify-center rounded-2xl">
            <p className="text-sm text-muted">New moments will appear here as teachers share them.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moments.map((m, i) => (
              <article key={m.id} className="glass overflow-hidden rounded-2xl">
                <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${tints[i % tints.length]}`}>
                  <Star className="h-10 w-10 text-white/70" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur">
                    {new Date(m.date).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-relaxed text-ink">{m.note}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => like(m.id)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                        m.liked ? "bg-accent-50 text-accent" : "bg-white/50 text-ink-500 hover:bg-white"
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${m.liked ? "fill-accent" : ""}`} />
                      {m.liked ? "Loved" : "Love this"}
                    </button>
                    <span className="text-xs text-muted">{first}'s teacher shared this</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
