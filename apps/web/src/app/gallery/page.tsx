import { PublicPage } from "@/components/PublicPage";

export default function GalleryPage() {
  return (
    <PublicPage
      eyebrow="Gallery"
      title="Classroom moments and academy spaces"
      summary="A warm visual placeholder for classroom activities, outdoor play, meals, art, and celebration days."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {["Classroom", "Playground", "Art", "Reading", "Meals", "Music", "Garden", "Celebrations"].map((label) => (
          <div className="flex aspect-[4/3] items-end rounded-2xl bg-gradient-to-br from-sand via-sunset/60 to-coral p-4 font-bold text-white shadow-soft" key={label}>
            {label}
          </div>
        ))}
      </div>
    </PublicPage>
  );
}
