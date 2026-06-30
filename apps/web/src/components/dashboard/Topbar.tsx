import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { initials, type CurrentUser } from "@/lib/auth";

export function Topbar({
  crumbs,
  title,
  action,
  user
}: {
  crumbs: string[];
  title: string;
  action?: React.ReactNode;
  user?: CurrentUser | null;
}) {
  const displayName = user?.name ?? "Academy";
  const avatarInitials = user ? initials(user.name) : "A";
  const notificationsHref =
    user?.role === "admin" ? "/app/admin/announcements" : `/app/${user?.role ?? "admin"}/dashboard`;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted">
            {crumbs.map((c, i) => (
              <span key={c} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                <span>{c}</span>
              </span>
            ))}
          </nav>
          <h1 className="mt-1 truncate font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-ink-500 transition focus-within:border-ink md:flex md:w-72">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none placeholder:text-ink-400" placeholder="Search records, families, classes…" />
          </label>
          <Link
            href={notificationsHref}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink-500 transition hover:border-ink hover:text-ink"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
          </Link>
          {action}
          <Link
            href={`/app/${user?.role ?? "admin"}/profile`}
            className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface pl-1 pr-3 transition hover:border-ink"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-display text-xs text-paper">
              {avatarInitials}
            </span>
            <span className="text-xs font-medium text-ink">{displayName}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
