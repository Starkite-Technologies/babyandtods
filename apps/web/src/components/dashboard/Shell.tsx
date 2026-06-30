import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { getCurrentUser } from "@/lib/auth";

export async function Shell({
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
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <Sidebar user={user} />
      <div className="min-w-0 flex-1">
        <Topbar crumbs={crumbs} title={title} action={action} user={user} />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
