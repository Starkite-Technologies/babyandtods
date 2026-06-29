import type { ReactNode } from "react";
import { clsx } from "clsx";

const tones = {
  neutral: "bg-cream text-muted",
  success: "bg-sage/15 text-sage",
  warning: "bg-sunset/20 text-[#9A6816]",
  danger: "bg-coral/20 text-terracotta"
};

export function Badge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
}) {
  return <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold capitalize", tones[tone])}>{children}</span>;
}
