import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({
  children,
  className,
  id,
  tone = "default"
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "default" | "muted" | "dark" | "accent";
}) {
  const tones = {
    default: "bg-paper text-ink",
    muted: "bg-ink-50/60 text-ink",
    dark: "bg-ink text-paper",
    accent: "bg-accent-50 text-ink"
  };
  return (
    <section id={id} className={cn("relative py-16 sm:py-20 lg:py-24", tones[tone], className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted">
          <span className="inline-block h-px w-6 bg-ink/30" />
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl font-medium tracking-tighter text-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      )}
    </div>
  );
}
