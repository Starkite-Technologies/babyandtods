// Deprecated. The new app uses `<PublicShell>` + `<PageHero>` directly.
import type { ReactNode } from "react";
import { PublicShell } from "./public/PublicShell";
import { PageHero } from "./public/PageHero";

export function PublicPage({
  eyebrow,
  title,
  summary,
  children
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <PublicShell>
      <PageHero eyebrow={eyebrow} title={title} description={summary} />
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">{children}</section>
    </PublicShell>
  );
}
