import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

const tones: Record<Tone, string> = {
  neutral: "bg-ink-50 text-ink-700 ring-1 ring-inset ring-ink-200/60",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/60",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/60",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200/60",
  info: "bg-sky-50 text-sky-800 ring-1 ring-inset ring-sky-200/60",
  accent: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200/60"
};

export function Badge({
  children,
  tone = "neutral",
  className
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
