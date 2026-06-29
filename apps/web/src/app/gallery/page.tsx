import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { PublicShell } from "@/components/public/PublicShell";
import { PageHero } from "@/components/public/PageHero";

const categories = ["All", "Classrooms", "Outdoor", "Art", "Reading", "Meals", "Music", "Celebrations"];

const moments = [
  { label: "Story circle", category: "Reading", aspect: "tall" },
  { label: "Garden play", category: "Outdoor", aspect: "wide" },
  { label: "Art table", category: "Art", aspect: "square" },
  { label: "Music time", category: "Music", aspect: "square" },
  { label: "Snack helper", category: "Meals", aspect: "tall" },
  { label: "Block tower", category: "Classrooms", aspect: "wide" },
  { label: "Sand pit", category: "Outdoor", aspect: "square" },
  { label: "Spring festival", category: "Celebrations", aspect: "tall" },
  { label: "Painting day", category: "Art", aspect: "wide" },
  { label: "Lunch family-style", category: "Meals", aspect: "square" },
  { label: "Carpet stories", category: "Reading", aspect: "square" },
  { label: "Birthday corner", category: "Celebrations", aspect: "wide" }
];

const aspectClass: Record<string, string> = {
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  square: "aspect-square"
};

export const metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <PublicShell>
      <PageHero
        eyebrow="Gallery"
        title="Real classrooms. Real children. Real days."
        description="A glimpse into the spaces, materials, and rhythms of the academy. Photos of named children are only ever shared on closed parent channels — never here."
      />

      <Section>
        <Container size="wide">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  i === 0 ? "bg-ink text-paper" : "border border-line bg-surface text-ink-600 hover:border-ink hover:text-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {moments.map((m, i) => (
              <button
                key={m.label + i}
                className={`group relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-ink-100 via-paper to-accent-50 text-left transition hover:border-ink/30 ${
                  m.aspect === "tall" ? "row-span-2" : m.aspect === "wide" ? "col-span-2" : ""
                }`}
              >
                <div className="absolute inset-0 bg-grid opacity-50" aria-hidden />
                <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
                  <div>
                    <Badge tone="neutral" className="!bg-surface/80 backdrop-blur">{m.category}</Badge>
                    <p className="mt-2 font-display text-lg font-medium leading-tight text-ink">{m.label}</p>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper opacity-0 transition group-hover:opacity-100">
                    +
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="border-t border-line">
        <Container size="narrow">
          <SectionHeader
            eyebrow="Photo policy"
            title="Whose photo goes where."
            align="center"
          />
          <div className="mx-auto mt-10 space-y-4 text-ink-700">
            <p>
              Photos of named, identifiable children are only shared on private, parent-only channels inside the family platform. They are never posted to the public gallery, social media, or marketing materials.
            </p>
            <p>
              The images here are of academy spaces, materials, and activities — not of individual children. We have written consent before any image of a child is taken or shared, and consent can be withdrawn at any time.
            </p>
          </div>
        </Container>
      </Section>
    </PublicShell>
  );
}
