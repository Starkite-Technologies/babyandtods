"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  BookOpen,
  CalendarCheck,
  Camera,
  ClipboardList,
  CreditCard,
  Home,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
  Users,
  WalletCards
} from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "@/components/Logo";

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
    <aside className="border-b border-line bg-white p-3 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:p-4">
      <div className="mb-3 rounded-xl px-2 py-1 lg:mb-7">
        <Logo />
      </div>
      <div className="mb-2 hidden px-3 text-[10px] font-bold uppercase tracking-widest text-muted lg:block">{role} space</div>
      <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
        {nav[role].map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              className={clsx(
                "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition lg:gap-3",
                active
                  ? "bg-gradient-to-r from-terracotta/10 to-sunset/10 text-terracotta shadow-sm"
                  : "text-deep hover:bg-cream hover:text-terracotta"
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
      <div className="mt-auto hidden rounded-2xl bg-gradient-to-br from-plum to-deep p-4 text-white lg:block">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
          <Sparkles className="h-3.5 w-3.5 text-sunset" />
          Academy note
        </p>
        <p className="mt-2 text-sm leading-6 text-white/90">Warm handovers, clear records, and calm operations in one shared space.</p>
      </div>
    </aside>
  );
}
