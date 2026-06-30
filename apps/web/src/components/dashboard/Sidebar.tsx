"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertTriangle, Baby, CalendarCheck, ClipboardList, CreditCard,
  FileText, Home, LogOut, MessageCircle, ShieldCheck,
  UserCheck, UserCircle, UserRoundCog, Users, WalletCards,
  FileSpreadsheet, KeyRound, School
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/Logo";
import { signOutAction } from "@/lib/actions";
import type { CurrentUser } from "@/lib/auth";

type Role = "parent" | "teacher" | "admin";

const nav: Record<Role, Array<{ href: string; label: string; icon: typeof Home }>> = {
  teacher: [
    { href: "/app/teacher/dashboard",    label: "Dashboard",      icon: Home },
    { href: "/app/teacher/my-class",     label: "My Class",       icon: School },
    { href: "/app/teacher/attendance",   label: "Attendance",     icon: CalendarCheck },
    { href: "/app/teacher/daily-reports",label: "Daily Reports",  icon: ClipboardList },
    { href: "/app/teacher/messages",     label: "Communication",  icon: MessageCircle },
    { href: "/app/teacher/profile",      label: "My Profile",     icon: UserCircle },
  ],
  parent: [
    { href: "/app/parent/dashboard",      label: "Dashboard",      icon: Home },
    { href: "/app/parent/child",          label: "Child Profile",  icon: Baby },
    { href: "/app/parent/attendance",     label: "Attendance",     icon: CalendarCheck },
    { href: "/app/parent/pickup-people",  label: "Pickup People",  icon: Users },
    { href: "/app/parent/billing",        label: "Billing",        icon: CreditCard },
    { href: "/app/parent/messages",       label: "Communication",  icon: MessageCircle },
    { href: "/app/parent/incidents",      label: "Incidents",      icon: AlertTriangle },
    { href: "/app/parent/documents",      label: "Documents",      icon: FileText },
    { href: "/app/parent/profile",        label: "My Profile",     icon: UserCircle },
  ],
  admin: [
    { href: "/app/admin/dashboard",  label: "Dashboard",     icon: Home },
    { href: "/app/admin/admissions", label: "Admissions",    icon: FileText },
    { href: "/app/admin/learners",   label: "Learners",      icon: Users },
    { href: "/app/admin/staff",      label: "Staff",         icon: UserRoundCog },
    { href: "/app/admin/finance",    label: "Finance",       icon: WalletCards },
    { href: "/app/admin/compliance", label: "Compliance",    icon: FileSpreadsheet },
    { href: "/app/admin/safety",     label: "Safety",        icon: ShieldCheck },
    { href: "/app/admin/users",      label: "Users & Access", icon: KeyRound },
    { href: "/app/admin/profile",    label: "My Profile",    icon: UserCircle },
  ],
};

function roleOf(pathname: string): Role {
  if (pathname.includes("/teacher/")) return "teacher";
  if (pathname.includes("/admin/")) return "admin";
  return "parent";
}

export function Sidebar({ user }: { user: CurrentUser | null }) {
  const pathname = usePathname();
  const role: Role = (user?.role as Role) ?? roleOf(pathname);
  const items = nav[role] ?? nav.admin;

  return (
    <aside className="border-b border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="hidden p-5 lg:block">
        <Logo />
      </div>

      <p className="hidden px-5 pt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-muted lg:block">
        {role} space
      </p>

      <nav
        aria-label={`${role} navigation`}
        className="no-scrollbar flex gap-1 overflow-x-auto p-3 lg:mt-2 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:p-3 lg:px-3 lg:pb-3 lg:pt-2"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition lg:w-full",
                active
                  ? "bg-ink text-paper"
                  : "text-ink-600 hover:bg-ink-50 hover:text-ink"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-paper" : "text-ink-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden p-3 lg:block">
        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink"
          >
            <LogOut className="h-4 w-4 text-ink-400" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
