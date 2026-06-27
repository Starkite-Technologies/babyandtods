import { Card } from "@/components/Card";
import { PublicPage } from "@/components/PublicPage";
import { Button } from "@/components/Button";

export default function HomePage() {
  return (
    <PublicPage
      eyebrow="Private early learning academy"
      title="Babies & Todd's Academy"
      summary="A nurturing Windhoek academy with warm classrooms, practical routines, and a private management system for families and staff."
    >
      <div className="space-y-8">
        <section className="grid gap-5 md:grid-cols-3">
          {["Babies", "Toddlers", "Pre-primary"].map((title) => (
            <Card key={title}>
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Age-aware care, structured play, and daily communication shaped by the academy&apos;s calm routine.</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card title="About the academy">
            <p className="text-sm leading-7 text-muted">
              Babies &amp; Todd&apos;s Academy is designed for gentle beginnings, confident toddlers, and school-ready children. The platform foundation reflects the same care: organized, warm, and practical.
            </p>
          </Card>
          <Card title="Why choose us">
            <div className="grid gap-3 sm:grid-cols-2">
              {["Small-group care", "Family updates", "Clear routines", "Safety-first records"].map((item) => (
                <div className="rounded-xl bg-cream p-3 text-sm font-bold" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card title="Admissions">
            <p className="mb-4 text-sm leading-7 text-muted">Families can explore programmes, fees, visits, and orientation before joining the academy community.</p>
            <Button href="/admissions">Start admissions</Button>
          </Card>
          <Card title="Contact">
            <p className="text-sm leading-7 text-muted">Windhoek, Namibia</p>
            <p className="text-sm leading-7 text-muted">Add phone and email when the academy is ready.</p>
          </Card>
        </section>
      </div>
    </PublicPage>
  );
}
