import Link from "next/link";
import { publicPages } from "@/data/mock-data";
import { Button } from "./Button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link className="flex items-center gap-3" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta to-sunset font-black text-white">
            B&amp;T
          </span>
          <span className="font-bold">Babies &amp; Todd&apos;s Academy</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-muted lg:flex">
          {publicPages.slice(1, 7).map((page) => (
            <Link className="hover:text-deep" href={page.href} key={page.href}>
              {page.label}
            </Link>
          ))}
        </nav>
        <Button href="/login" variant="secondary">
          Login
        </Button>
      </div>
    </header>
  );
}
