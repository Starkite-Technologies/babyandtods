import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";

const groups = [
  {
    title: "Academy",
    links: [
      { label: "About us", href: "/about" },
      { label: "Programmes", href: "/programmes" },
      { label: "Admissions", href: "/admissions" },
      { label: "Fees", href: "/fees" },
      { label: "Gallery", href: "/gallery" }
    ]
  },
  {
    title: "Families",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Visit us", href: "/visit" },
      { label: "Parent portal", href: "/app/parent/dashboard" },
      { label: "Apply now", href: "/admissions" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "News & blog", href: "/news" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Staff sign-in", href: "/login" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(135deg,#0D1430,#137AF0_48%,#7A2DD4)] text-paper">
      <div className="absolute inset-x-0 top-0 h-1 bg-rainbow" aria-hidden />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-pink/25 blur-3xl" aria-hidden />
      <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-brand-green/20 blur-3xl" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo invert />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/75">
              A bright early-learning academy in Windhoek for babies, toddlers, and pre-primary children, built around joyful growth and clear family communication.
            </p>
            <div className="mt-8 space-y-3 text-sm text-paper/85">
              <a className="group flex items-start gap-3 hover:text-paper" href="https://maps.google.com/?q=Windhoek+Namibia">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
                <span className="link-underline">Windhoek, Namibia</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
              </a>
              <a className="group flex items-start gap-3 hover:text-paper" href="tel:+264000000000">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                <span className="link-underline">+264 81 000 0000</span>
              </a>
              <a className="group flex items-start gap-3 hover:text-paper" href="mailto:hello@babiesandtods.com">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" />
                <span className="link-underline">hello@babiesandtods.com</span>
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/55">{group.title}</p>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link className="link-underline text-sm text-paper/88 hover:text-brand-yellow" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-paper/15 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-paper/60">
            © {new Date().getFullYear()} Babies &amp; Todd&apos;s Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-paper/70">
            <Link className="link-underline hover:text-brand-yellow" href="/privacy">Privacy</Link>
            <Link className="link-underline hover:text-brand-yellow" href="/terms">Terms</Link>
            <Link className="link-underline hover:text-brand-yellow" href="/safeguarding">Safeguarding</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
