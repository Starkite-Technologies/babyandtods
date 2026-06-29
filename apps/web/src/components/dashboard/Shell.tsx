import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function Shell({
  crumbs,
  title,
  action,
  children
}: {
  crumbs: string[];
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated rainbow aurora backdrop behind all glass surfaces */}
      <div className="aurora" aria-hidden>
        <div className="aurora-blob b1" />
        <div className="aurora-blob b2" />
        <div className="aurora-blob b3" />
        <div className="aurora-blob b4" />
        <div className="aurora-blob b5" />
      </div>

      <div className="relative z-10 lg:flex">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Topbar crumbs={crumbs} title={title} action={action} />
          <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
