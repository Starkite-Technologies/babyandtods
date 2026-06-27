"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import type { UserRole } from "@babies-tods/shared";

const roles: Array<{ role: UserRole; href: string }> = [
  { role: "parent", href: "/app/parent/dashboard" },
  { role: "teacher", href: "/app/teacher/dashboard" },
  { role: "admin", href: "/app/admin/dashboard" }
];

export function RoleSwitcher() {
  const pathname = usePathname();

  return (
    <div className="mb-5 grid grid-cols-3 rounded-xl bg-cream p-1">
      {roles.map((item) => {
        const active = pathname.includes(`/app/${item.role}`);
        return (
          <Link
            className={clsx(
              "rounded-lg px-2 py-2 text-center text-xs font-bold capitalize transition",
              active ? "bg-white text-deep shadow-sm" : "text-muted hover:text-deep"
            )}
            href={item.href}
            key={item.role}
          >
            {item.role}
          </Link>
        );
      })}
    </div>
  );
}
