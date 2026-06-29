import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Card } from "./Card";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const toneText: Record<Tone, string> = {
  neutral: "text-ink",
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-red-700",
  accent: "text-accent-600"
};

export function StatCard({
  label,
  value,
  detail,
  icon,
  tone = "neutral",
  trend,
  href
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  icon?: ReactNode;
  tone?: Tone;
  trend?: { value: string; up?: boolean };
  href?: string;
}) {
  return (
    <Card href={href} className="!p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <p className={cn("mt-3 font-display text-3xl font-medium tracking-tight", toneText[tone])}>
        {value}
      </p>
      <div className="mt-2 flex items-center gap-2">
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.up ? "text-emerald-600" : "text-red-600"
            )}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
        {detail && <p className="text-xs text-muted">{detail}</p>}
      </div>
    </Card>
  );
}
