"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function Logo({
  invert = false,
  showWord = true,
  href = "/"
}: {
  invert?: boolean;
  showWord?: boolean;
  href?: string;
}) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <Link href={href} className="group inline-flex items-center gap-3">
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/babies-todds-academy-logo.png"
          alt="Babies & Todd's Academy"
          onError={() => setImgOk(false)}
          className="h-14 w-14 shrink-0 rounded-full border-2 border-white bg-white object-contain p-0.5 shadow-lift transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
        />
      ) : (
        <span
          className="bg-brand-grad relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-lift transition-transform duration-300 group-hover:-rotate-3"
          aria-hidden
        >
          <span className="text-sm font-black text-white">B&T</span>
        </span>
      )}

      {showWord && (
        <span className="flex flex-col leading-tight">
          <span className="text-rainbow font-display text-[16px] font-bold tracking-tight">Babies &amp; Todd&apos;s</span>
          <span className={cn("text-[9px] font-black uppercase tracking-[0.22em]", invert ? "text-brand-yellow" : "text-brand-blue")}>
            Academy
          </span>
        </span>
      )}
    </Link>
  );
}
