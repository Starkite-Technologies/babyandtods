"use client";

import { useEffect, useState } from "react";
import { Check, Info, AlertTriangle, Sparkles } from "lucide-react";

export type ToastTone = "success" | "info" | "accent" | "danger";
type ToastItem = { id: number; message: string; tone: ToastTone };

let counter = 0;

export function toast(message: string, tone: ToastTone = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { id: ++counter, message, tone } }));
}

const icons = {
  success: Check,
  info: Info,
  accent: Sparkles,
  danger: AlertTriangle
};

const toneCls: Record<ToastTone, string> = {
  success: "text-emerald-600",
  info: "text-sky",
  accent: "text-accent",
  danger: "text-red-600"
};

export function ToastStack() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function on(e: Event) {
      const d = (e as CustomEvent).detail as ToastItem;
      setItems((x) => [...x, d]);
      setTimeout(() => setItems((x) => x.filter((i) => i.id !== d.id)), 3400);
    }
    window.addEventListener("app-toast", on);
    return () => window.removeEventListener("app-toast", on);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(92vw,340px)] flex-col gap-2">
      {items.map((it) => {
        const Icon = icons[it.tone];
        return (
          <div
            key={it.id}
            className="glass-strong animate-toast pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-3"
          >
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/70 ${toneCls[it.tone]}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-ink">{it.message}</p>
          </div>
        );
      })}
    </div>
  );
}
