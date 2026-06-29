import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const featured = {
  category: "Academy",
  date: "20 Jun 2026",
  read: "4 min",
  title: "Now enrolling for the 2027 term",
  excerpt:
    "We&apos;re opening a small number of places across babies, toddlers, and pre-primary for the 2027 academic year. Here&apos;s what to expect, how to apply, and the tour dates we&apos;re holding for prospective families.",
  href: "/news/2027-enrolment"
};

const posts = [
  {
    category: "Learning",
    date: "14 Jun 2026",
    read: "6 min",
    title: "Why we don&apos;t use flashcards",
    excerpt: "A look at what we use instead — and the research behind it.",
    href: "/news/no-flashcards"
  },
  {
    category: "Safety",
    date: "02 Jun 2026",
    read: "3 min",
    title: "How our pickup verification actually works",
    excerpt: "Behind the scenes of every authorized handover, every day.",
    href: "/news/pickup-verification"
  },
  {
    category: "Stories",
    date: "28 May 2026",
    read: "5 min",
    title: "A morning in the Sunshine room",
    excerpt: "07:30 to 12:30, written up by the lead teacher.",
    href: "/news/sunshine-morning"
  },
  {
    category: "Families",
    date: "12 May 2026",
    read: "4 min",
    title: "Settling in: the first ten days",
    excerpt: "What works, what doesn&apos;t, and what to expect.",
    href: "/news/settling-in"
  },
  {
    category: "Academy",
    date: "30 Apr 2026",
    read: "2 min",
    title: "Winter wellness week",
    excerpt: "Routines, layers, and how we handle the colder mornings.",
    href: "/news/winter-wellness"
  },
  {
    category: "Learning",
    date: "08 Apr 2026",
    read: "5 min",
    title: "Letter sounds before letter names",
    excerpt: "Our approach to early literacy, and why phonics comes first.",
    href: "/news/letter-sounds"
  }
];

export const metadata = { title: "News" };

export default function NewsPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="News & blog"
        title="Notes from the academy."
        description="What we&apos;re learning, what we&apos;re changing, and the small stories of the rooms."
      />

      <Section>
        <Container size="wide">
          <Card href={featured.href} interactive className="!p-0 overflow-hidden">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[280px] bg-gradient-to-br from-ink to-ink-700 p-8 lg:min-h-[420px]">
                <div className="absolute inset-0 bg-grid opacity-10" aria-hidden />
                <div className="relative">
                  <Badge tone="accent">Featured</Badge>
                  <p className="mt-4 font-display text-2xl font-medium leading-tight tracking-tight text-paper sm:text-3xl">
                    Now enrolling for the 2027 term
                  </p>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="font-medium uppercase tracking-wider">{featured.category}</span>
                  <span>·</span>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.read} read</span>
                </div>
                <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-relaxed text-ink-600">{featured.excerpt}</p>
                <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                  Read article <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      <Section tone="muted" className="border-y border-line">
        <Container size="wide">
          <SectionHeader eyebrow="Latest" title="More from the academy." />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.href} href={post.href} interactive className="flex h-full flex-col">
                <Badge tone="neutral">{post.category}</Badge>
                <h3 className="mt-4 font-display text-xl font-medium tracking-tight text-ink">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
                  <span>{post.date}</span>
                  <span>{post.read} read</span>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
