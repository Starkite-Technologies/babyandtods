import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const channels = [
  {
    icon: Phone,
    title: "Phone",
    value: "+264 81 000 0000",
    detail: "Mon–Fri · 07:00–17:30",
    href: "tel:+264000000000"
  },
  {
    icon: Mail,
    title: "Email",
    value: "hello@babiesandtods.com",
    detail: "Replies within 1 working day",
    href: "mailto:hello@babiesandtods.com"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Chat with reception",
    detail: "Quick replies during office hours",
    href: "https://wa.me/264000000000"
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: "Windhoek, Namibia",
    detail: "By appointment · book a tour",
    href: "/visit"
  }
];

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Contact"
        title="We&apos;re easy to reach."
        description="Phone us, email us, or send a message. We reply within one working day — usually faster."
      />

      <Section>
        <Container size="wide">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} href={c.href} interactive>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-paper">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted">{c.title}</p>
                  <p className="mt-1 font-display text-lg font-medium tracking-tight text-ink">{c.value}</p>
                  <p className="mt-2 text-sm text-muted">{c.detail}</p>
                </Card>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-t border-line">
        <Container size="narrow">
          <SectionHeader
            eyebrow="Send a message"
            title="Tell us what you need."
            align="center"
          />
          <form className="mt-12 space-y-6 rounded-3xl border border-line bg-surface p-6 sm:p-8 lg:p-10">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Your name" name="name" placeholder="Full name" required />
              <Input label="Email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-ink">What is this about?</label>
              <select
                name="topic"
                className="h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/5"
              >
                <option>Enrolment & admissions</option>
                <option>Tour booking</option>
                <option>Fees & billing</option>
                <option>Existing family question</option>
                <option>Careers</option>
                <option>Press / partnership</option>
                <option>Something else</option>
              </select>
            </div>
            <Textarea label="Message" name="message" placeholder="Tell us a little about what you&apos;re looking for…" required />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <p className="text-xs text-muted">We never share your contact details with third parties.</p>
              <Button type="submit">Send message <ArrowRight className="h-4 w-4" /></Button>
            </div>
          </form>
        </Container>
      </Section>
    </PublicShell>
  );
}
