import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const base =
  "w-full rounded-xl border border-line bg-surface px-4 text-sm text-ink placeholder:text-ink-400 transition focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/5";

export function Input({
  label,
  hint,
  className,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input id={inputId} className={cn(base, "h-11", className)} {...props} />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  hint,
  className,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; hint?: string }) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea id={inputId} className={cn(base, "min-h-[120px] py-3", className)} {...props} />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
