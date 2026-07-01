"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * TEMPORARY DIAGNOSTIC COMPONENT — measures how many milliseconds pass
 * between clicking a link and the new page finishing its render, and
 * shows it as a small badge (+ logs it to the console) so you can confirm
 * real click-to-page numbers instead of just a "feeling" of slowness.
 *
 * How to read it:
 *  - Click any internal link/nav item.
 *  - A badge appears bottom-right for a few seconds: "/path -> 123ms"
 *  - Every reading is also logged to the browser console as [nav-timer].
 *
 * Limitations (it's approximate, not a profiler):
 *  - Only times clicks on <a>/<Link> elements (not router.push() calls
 *    fired from plain buttons, if any exist).
 *  - The "ms" is time from click to the new route committing in React,
 *    which bundles together: middleware, the RSC/data fetch, and render —
 *    it won't tell you which of those is slow, just the total.
 *  - Full-page redirects (e.g. a server redirect from middleware) remount
 *    this component and won't produce a reading for that specific hop.
 *
 * TO REMOVE once you're done measuring: delete this file, and delete the
 * `<NavTimer />` line + its import in apps/web/src/app/layout.tsx.
 */
export function NavTimer() {
  const pathname = usePathname();
  const clickedAt = useRef<number | null>(null);
  const [readout, setReadout] = useState<{ ms: number; path: string } | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || /^(https?:)?\/\//.test(href) || href.startsWith("#") || anchor.target === "_blank") {
        return;
      }
      clickedAt.current = performance.now();
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (clickedAt.current == null) return;
    const ms = Math.round(performance.now() - clickedAt.current);
    clickedAt.current = null;
    setReadout({ ms, path: pathname });
    // eslint-disable-next-line no-console
    console.log(`[nav-timer] ${pathname} rendered ${ms}ms after click`);
    const hide = setTimeout(() => setReadout(null), 5000);
    return () => clearTimeout(hide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!readout) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 99999,
        background: "#111",
        color: "#fff",
        padding: "10px 16px",
        borderRadius: 10,
        fontSize: 13,
        lineHeight: 1.4,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        boxShadow: "0 6px 20px rgba(0,0,0,.35)",
        pointerEvents: "none"
      }}
    >
      <div style={{ opacity: 0.6, fontSize: 11 }}>nav-timer (temp)</div>
      <div>
        {readout.path} <strong>&rarr; {readout.ms}ms</strong>
      </div>
    </div>
  );
}
