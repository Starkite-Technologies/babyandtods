import type { ReactNode } from "react";
import { clsx } from "clsx";

export function Card({
  title,
  action,
  children,
  className
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-2xl border border-line/70 bg-white p-4 shadow-soft sm:p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-sm font-bold text-deep">{title}</h2> : <span />}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
