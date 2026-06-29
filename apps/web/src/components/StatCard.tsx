import type { DashboardStat } from "@babies-tods/shared";
import { Card } from "./Card";

const toneClass = {
  neutral: "text-deep",
  success: "text-sage",
  warning: "text-[#9A6816]",
  danger: "text-terracotta"
};

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <Card className="p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_34px_rgba(43,33,24,0.1)]">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{stat.label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass[stat.tone ?? "neutral"]}`}>{stat.value}</p>
      <p className="mt-2 text-xs text-muted">{stat.detail}</p>
    </Card>
  );
}
