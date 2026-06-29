import Link from "next/link";
import { Bell, Search } from "lucide-react";

export function Topbar({ crumbs, title, action }: { crumbs: string[]; title: string; action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/45 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted">
            {crumbs.map((c, i) => (
              <span key={c} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-ink-300">/</span>}
                <span className={i === crumbs.length - 1 ? "text-ink-600" : ""}>{c}</span>
              </span>
            ))}
          </nav>
          <h1 className="mt-1 truncate font-display text-xl font-medium tracking-tight text-ink sm:text-2xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="hidden h-10 items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 text-sm text-ink-500 backdrop-blur transition focus-within:border-accent md:flex md:w-72">
            <Search className="h-4 w-4" />
            <input className="w-full bg-transparent outline-none placeholder:text-ink-400" placeholder="Search families, classes…" />
          </label>
          <Link
            href="/app/admin/announcements"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/50 text-ink-500 backdrop-blur transition hover:border-accent hover:text-ink"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent text-accent pulse-dot" />
          </Link>
          {action}
          <div className="flex h-10 items-center gap-2 rounded-full border border-white/60 bg-white/60 pl-1 pr-3 shadow-soft backdrop-blur">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/babies-todds-academy-logo.png"
              alt="Babies & Todd's Academy"
              className="h-8 w-8 rounded-full bg-white object-contain p-0.5"
            />
            <span className="hidden text-xs font-medium text-ink sm:inline">Academy</span>
          </div>
        </div>
      </div>
    </header>
  );
}
