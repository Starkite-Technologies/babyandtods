import { Bell, CalendarDays, Search } from "lucide-react";

export function Topbar({ crumb, title }: { crumb: string; title: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-line bg-white/95 px-4 py-3 backdrop-blur sm:px-5 lg:px-7">
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-muted">{crumb}</p>
        <h1 className="truncate text-lg font-bold text-deep sm:text-xl">{title}</h1>
      </div>
      <div className="hidden items-center gap-3 md:flex">
        <label className="flex h-10 w-72 items-center gap-2 rounded-xl border border-line bg-cream px-3 text-muted">
          <Search className="h-4 w-4" />
          <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted" placeholder="Search academy records" />
        </label>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-cream text-deep" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-terracotta" />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-cream py-1 pl-1 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sage to-[#4A6C40] text-xs font-bold text-white">
            AG
          </span>
          <span className="text-xs font-bold">Academy</span>
        </div>
      </div>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cream text-terracotta md:hidden">
        <CalendarDays className="h-4 w-4" />
      </div>
    </header>
  );
}
