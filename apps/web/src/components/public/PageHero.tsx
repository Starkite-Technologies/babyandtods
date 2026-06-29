import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  meta,
  align = "left"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className="relative overflow-hidden border-b border-white/70 bg-paper">
      <div className="absolute inset-0 bg-grid bg-grid-fade opacity-80" aria-hidden />
      <div className="absolute right-0 top-0 h-2 w-full bg-rainbow" aria-hidden />
      <div className="absolute -right-10 top-12 h-40 w-40 rounded-full border-[28px] border-brand-pink/20" aria-hidden />
      <div className="absolute bottom-8 left-0 h-24 w-24 rounded-full bg-brand-green/20" aria-hidden />
      <div
        className={cn(
          "relative mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-24",
          align === "center" && "text-center"
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brand-purple animate-fade-in",
              align === "center" && "justify-center"
            )}
          >
            <span className="inline-block h-px w-6 bg-brand-pink" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tighter text-ink animate-fade-in sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-6 max-w-2xl text-lg leading-relaxed text-ink-600 animate-fade-in-slow",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
        {actions && (
          <div
            className={cn(
              "mt-8 flex flex-wrap gap-3 animate-fade-in-slow",
              align === "center" && "justify-center"
            )}
          >
            {actions}
          </div>
        )}
        {meta && <div className="mt-12 animate-fade-in-slow">{meta}</div>}
      </div>
    </section>
  );
}
