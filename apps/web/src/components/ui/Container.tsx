import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  children,
  className,
  size = "default"
}: {
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
}) {
  const sizes = {
    narrow: "max-w-3xl",
    default: "max-w-6xl",
    wide: "max-w-7xl"
  };
  return <div className={cn("mx-auto px-5 sm:px-6 lg:px-8", sizes[size], className)}>{children}</div>;
}
