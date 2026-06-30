"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

const primary = [
  {
    label: "Programmes",
    href: "/programmes",
    children: [
      { label: "Babies (3–18m)", href: "/programmes/babies" },
      { label: "Toddlers (18m–3y)", href: "/programmes/toddlers" },
      { label: "Pre-primary (3–5y)", href: "/programmes/pre-primary" },
      { label: "Aftercare", href: "/programmes/aftercare" }
    ]
  },
  { label: "Admissions", href: "/admissions" },
  { label: "Fees", href: "/fees" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-white/95 shadow-soft backdrop-blur-xl"
          : "border-b border-line bg-white/80 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primary.map((item) => {
            const active =
              pathname === item.href ||
              (item.children && pathname.startsWith(item.href + "/"));
            return (
              <div className="relative group" key={item.href}>
                <Link
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition",
                    active ? "bg-white text-brand-blue shadow-soft ring-1 ring-line" : "text-ink-600 hover:bg-ink-50 hover:text-brand-pink"
                  )}
                  href={item.href}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />
                  )}
                </Link>
                {item.children && (
                  <div className="glass-strong invisible absolute left-1/2 top-full z-10 mt-1 w-60 -translate-x-1/2 translate-y-1 rounded-2xl p-2 opacity-0 shadow-lift transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        className="block rounded-lg px-3 py-2 text-sm text-ink-600 transition hover:bg-ink-50 hover:text-brand-blue"
                        href={child.href}
                        key={child.href}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/login" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href="/admissions" size="sm">
            Apply
          </Button>
        </div>
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-soft backdrop-blur lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden">
          <div className="glass-strong border-t border-line px-5 py-4">
            <ul className="space-y-1">
              {primary.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block rounded-xl px-3 py-2.5 text-base font-medium text-ink hover:bg-ink-50 hover:text-brand-blue"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-3 mt-1 space-y-0.5 border-l border-line pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            className="block rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-50 hover:text-brand-pink"
                            href={child.href}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button href="/login" variant="secondary" className="w-full">
                Sign in
              </Button>
              <Button href="/admissions" className="w-full">
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
