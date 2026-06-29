import type { ReactNode } from "react";

export function Timeline({
  items
}: {
  items: Array<{ time: string; title: string; detail?: string; icon?: ReactNode }>;
}) {
  return (
    <ol className="relative space-y-5 border-l border-line pl-6">
      {items.map((item, i) => (
        <li className="relative" key={`${item.time}-${i}`}>
          <span className="absolute -left-[27px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-surface ring-2 ring-line">
            <span className="h-1.5 w-1.5 rounded-full bg-ink" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{item.time}</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{item.title}</p>
          {item.detail && <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>}
        </li>
      ))}
    </ol>
  );
}
