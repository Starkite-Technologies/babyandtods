"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Baby, BookOpen, CalendarCheck, Camera, CreditCard, Home, MessageCircle, ShieldCheck, Users, WalletCards, ClipboardList, UserRoundCog } from "lucide-react";
import { clsx } from "clsx";
import { RoleSwitcher } from "./RoleSwitcher";

const nav = {
  parent: [
    { href: "/app/parent/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/parent/child", label: "My Child", icon: Baby },
    { href: "/app/parent/learning", label: "Learning", icon: BookOpen },
    { href: "/app/parent/memories", label: "Memories", icon: Camera },
    { href: "/app/parent/messages", label: "Messages", icon: MessageCircle },
    { href: "/app/parent/check-in", label: "Check-In", icon: CalendarCheck },
    { href: "/app/parent/billing", label: "Billing", icon: CreditCard }
  ],
  teacher: [
    { href: "/app/teacher/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/teacher/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/app/teacher/daily-reports", label: "Daily Reports", icon: ClipboardList },
    { href: "/app/teacher/messages", label: "Messages", icon: MessageCircle }
  ],
  admin: [
    { href: "/app/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/app/admin/learners", label: "Learners", icon: Users },
    { href: "/app/admin/staff", label: "Staff", icon: UserRoundCog },
    { href: "/app/admin/finance", label: "Finance", icon: WalletCards },
    { href: "/app/admin/compliance", label: "Compliance", icon: ClipboardList },
    { href: "/app/admin/safety", label: "Safety", icon: ShieldCheck }
  ]
};

function activeRole(pathname: string) {
  if (pathname.includes("/teacher/")) return "teacher";
  if (pathname.includes("/admin/")) return "admin";
  return "parent";
}

export function Sidebar() {
  const pathname = usePathname();
  const role = activeRole(pathname);

  return (
    <aside className="hidden w-64 shrink-0 border-r border-line bg-white p-4 lg:flex lg:flex-col">
      <Link className="mb-7 flex items-center gap-3 rounded-xl px-2 py-1" href="/">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta to-sunset text-lg font-black text-white shadow-soft">
          B&amp;T
        </div>
        <div>
          <p className="text-sm font-bold leading-tight">Babies &amp; Todd&apos;s</p>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Academy</p>
        </div>
      </Link>
      <RoleSwitcher />
      <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted">{role} space</div>
      <nav className="space-y-1">
        {nav[role].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              className={clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-terracotta/10 text-terracotta" : "text-deep hover:bg-cream"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl bg-gradient-to-br from-plum to-deep p-4 text-white">
        <p className="text-xs font-bold uppercase tracking-wider text-white/70">Academy note</p>
        <p className="mt-2 text-sm leading-6 text-white/90">Warm handovers, clear records, and calm operations in one shared space.</p>
      </div>
    </aside>
  );
}
