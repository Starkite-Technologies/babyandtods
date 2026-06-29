"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby, BarChart3, CalendarCheck, CreditCard, Home, MessageCircle, Sparkles,
  UserRoundCog, Users, WalletCards, KeyRound, QrCode,
  ClipboardList, LogOut, Activity
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/Logo";

type Role = "parent" | "teacher" | "admin";

const nav: Record<Role, Array<{ href: string; label: string; icon: typeof Home }>> = {
  parent: [
    { href: "/app/parent/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/parent/child", label: "Child Profile", icon: Baby },
    { href: "/app/parent/journey", label: "Journey", icon: Sparkles },
    { href: "/app/parent/messages", label: "Messages", icon: MessageCircle },
    { href: "/app/parent/check-in", label: "Live Pass", icon: CalendarCheck },
    { href: "/app/parent/billing", label: "Payments", icon: CreditCard }
  ],
  teacher: [
    { href: "/app/teacher/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/teacher/attendance", label: "Check-in", icon: QrCode },
    { href: "/app/teacher/daily-reports", label: "Daily reports", icon: ClipboardList },
    { href: "/app/teacher/messages", label: "Messages", icon: MessageCircle }
  ],
  admin: [
    { href: "/app/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/admin/operations", label: "Live Operations", icon: Activity },
    { href: "/app/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/app/admin/learners", label: "Learners", icon: Users },
    { href: "/app/admin/staff", label: "Staff", icon: UserRoundCog },
    { href: "/app/admin/finance", label: "Finance", icon: WalletCards },
    { href: "/app/teacher/messages", label: "Messages", icon: MessageCircle },
    { href: "/app/admin/users", label: "Users & Access", icon: KeyRound }
  ]
};

function roleOf(pathname: string): Role {
  if (pathname.includes("/teacher/")) return "teacher";
  if (pathname.includes("/admin/")) return "admin";
  return "parent";
}

export function Sidebar() {
  const pathname = usePathname();
  const role = roleOf(pathname);

  return (
    <aside className="glass-strong border-0 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-white/40">
      <div className="hidden p-5 lg:block">
        <Logo />
      </div>

      <p className="hidden px-5 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted lg:block">
        {role} space
      </p>

      <nav
        aria-label={`${role} navigation`}
        className="no-scrollbar flex gap-1 overflow-x-auto p-3 lg:mt-2 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:p-3 lg:pt-2"
      >
        {nav[role].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all lg:w-full",
                active
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "text-ink-600 hover:bg-white/60 hover:text-ink"
              )}
            >
              <Icon className={cn("h-4 w-4 transition", active ? "text-white" : "text-ink-400 group-hover:text-brand-pink")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden p-3 lg:block">
        <Link
          href="/login"
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-white/60 hover:text-ink"
        >
          <LogOut className="h-4 w-4 text-ink-400" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
