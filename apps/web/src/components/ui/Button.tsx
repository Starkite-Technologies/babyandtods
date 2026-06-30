import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "accent" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-soft hover:bg-ink-700",
  secondary:
    "border border-line bg-white text-ink shadow-soft hover:border-brand-blue/50 hover:bg-ink-50",
  ghost:
    "text-ink hover:bg-ink-50",
  accent:
    "bg-brand-green text-white hover:bg-brand-green/90 shadow-soft",
  outline:
    "border border-brand-blue/45 bg-white text-ink hover:bg-brand-blue hover:text-white"
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base"
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    if (external) {
      return (
        <a className={classes} href={href} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
