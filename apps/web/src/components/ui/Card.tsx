import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  title,
  description,
  action,
  href,
  children,
  className,
  interactive,
  accentTop
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  href?: string;
  children?: ReactNode;
  className?: string;
  interactive?: boolean;
  accentTop?: boolean;
}) {
  const inner = (
    <>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold tracking-tight text-ink">{title}</h3>}
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </>
  );

  const cls = cn(
    "glass rounded-2xl p-5 sm:p-6",
    accentTop && "glass-accent-top",
    (interactive || href) &&
      "group cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:glass-strong",
    className
  );

  if (href) {
    return (
      <Link className={cls} href={href}>
        {inner}
      </Link>
    );
  }
  return <div className={cls}>{inner}</div>;
}
