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
    <Card className="p-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{stat.label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass[stat.tone ?? "neutral"]}`}>{stat.value}</p>
      <p className="mt-2 text-xs text-muted">{stat.detail}</p>
    </Card>
  );
}
