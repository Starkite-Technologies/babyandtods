import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardLayout({
  crumb,
  title,
  children
}: {
  crumb: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream lg:flex">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Topbar crumb={crumb} title={title} />
        <div className="p-5 lg:p-7">{children}</div>
      </main>
    </div>
  );
}
