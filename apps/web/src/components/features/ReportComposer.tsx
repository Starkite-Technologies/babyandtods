"use client";

import { useState, useTransition } from "react";
import { Sparkles, Send, Check } from "lucide-react";
import { saveReportAction } from "@/lib/actions";
import { toast } from "@/components/ui/Toast";

type Child = { id: string; name: string };

const moods = ["cheerful", "calm", "curious", "energetic", "a little tired", "affectionate"];
const meals = ["ate everything", "ate most of lunch", "had a light appetite", "loved the fruit", "tried something new"];
const naps = ["No nap", "30 min", "1 hour", "1h 30m", "2 hours"];
const activities = ["story circle", "outdoor play", "painting", "building blocks", "music & singing", "water play", "counting games", "puzzles"];
const highlights = ["made a new friend", "shared toys kindly", "spoke in full sentences", "showed great focus", "helped tidy up", "counted to ten"];

function buildDraft(name: string, picks: { mood?: string; meal?: string; nap: string; acts: string[]; highs: string[] }) {
  const first = name.split(" ")[0] || "Your child";
  const parts: string[] = [];
  parts.push(`${first} had a ${picks.mood ?? "lovely"} day with us.`);
  if (picks.acts.length) {
    const a = picks.acts.length === 1 ? picks.acts[0] : `${picks.acts.slice(0, -1).join(", ")} and ${picks.acts.slice(-1)}`;
    parts.push(`Today we enjoyed ${a}.`);
  }
  if (picks.highs.length) {
    parts.push(`A lovely moment: ${first} ${picks.highs.join(", and ")}.`);
  }
  if (picks.meal) parts.push(`At mealtime ${first} ${picks.meal}.`);
  parts.push(picks.nap === "No nap" ? `${first} stayed awake through rest time today.` : `${first} rested for about ${picks.nap.toLowerCase()}.`);
  parts.push(`We can't wait to see ${first} again tomorrow!`);
  return parts.join(" ");
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-ink text-paper" : "bg-white text-ink-600 ring-1 ring-inset ring-line hover:bg-ink-50"
      }`}
    >
      {children}
    </button>
  );
}

export function ReportComposer({ children }: { children: Child[] }) {
  const [childId, setChildId] = useState(children[0]?.id ?? "");
  const [mood, setMood] = useState<string>();
  const [meal, setMeal] = useState<string>();
  const [nap, setNap] = useState(naps[2]);
  const [acts, setActs] = useState<string[]>([]);
  const [highs, setHighs] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [drafting, setDrafting] = useState(false);
  const [sent, setSent] = useState(false);
  const [, startTransition] = useTransition();

  const child = children.find((c) => c.id === childId);
  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  function generate() {
    if (!child) return;
    setDrafting(true);
    setSent(false);
    setTimeout(() => {
      setDraft(buildDraft(child.name, { mood, meal, nap, acts, highs }));
      setDrafting(false);
      toast("Draft ready — edit then send", "accent");
    }, 700);
  }

  function send() {
    if (!child || !draft.trim()) return;
    setSent(true);
    toast(`Report sent to ${child.name.split(" ")[0]}'s family`, "success");
    startTransition(async () => {
      await saveReportAction({
        childId,
        meals: meal ?? "—",
        nap,
        learningNote: draft,
        status: "sent"
      });
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Builder */}
      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted">Learner</label>
          <select
            value={childId}
            onChange={(e) => {
              setChildId(e.target.value);
              setDraft("");
              setSent(false);
            }}
            className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/10"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Group label="Mood">
          {moods.map((m) => (
            <Chip key={m} active={mood === m} onClick={() => setMood(mood === m ? undefined : m)}>
              {m}
            </Chip>
          ))}
        </Group>

        <Group label="Activities">
          {activities.map((a) => (
            <Chip key={a} active={acts.includes(a)} onClick={() => toggle(acts, setActs, a)}>
              {a}
            </Chip>
          ))}
        </Group>

        <Group label="Highlights">
          {highlights.map((h) => (
            <Chip key={h} active={highs.includes(h)} onClick={() => toggle(highs, setHighs, h)}>
              {h}
            </Chip>
          ))}
        </Group>

        <Group label="Mealtime">
          {meals.map((m) => (
            <Chip key={m} active={meal === m} onClick={() => setMeal(meal === m ? undefined : m)}>
              {m}
            </Chip>
          ))}
        </Group>

        <Group label="Nap">
          {naps.map((n) => (
            <Chip key={n} active={nap === n} onClick={() => setNap(n)}>
              {n}
            </Chip>
          ))}
        </Group>

        <button
          onClick={generate}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
        >
          <Sparkles className="h-4 w-4" />
          Generate draft
        </button>
      </div>

      {/* Draft */}
      <div className="glass-accent-top flex flex-col rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold text-ink">AI draft</h3>
          </div>
          {child && <span className="text-xs text-muted">for {child.name}</span>}
        </div>

        {drafting ? (
          <div className="flex-1 space-y-2.5 py-4">
            {[100, 92, 96, 70].map((w, i) => (
              <div key={i} className="shimmer h-3.5 rounded-full bg-ink-100" style={{ width: `${w}%` }} />
            ))}
            <p className="pt-2 text-xs text-muted">Composing a warm, parent-ready note…</p>
          </div>
        ) : draft ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={9}
            className="flex-1 resize-none rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/10"
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-ink">Pick a few chips, then generate</p>
            <p className="mt-1 max-w-xs text-xs text-muted">
              The assistant turns your taps into a friendly, polished report you can edit before sending.
            </p>
          </div>
        )}

        {draft && !drafting && (
          <button
            onClick={send}
            disabled={sent}
            className={`mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition ${
              sent ? "bg-emerald-500" : "bg-ink hover:bg-ink-800"
            }`}
          >
            {sent ? (
              <>
                <Check className="h-4 w-4" /> Sent to family
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Send to parent
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}
