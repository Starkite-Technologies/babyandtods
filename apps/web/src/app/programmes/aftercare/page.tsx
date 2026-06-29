import { ProgrammeDetail, type Programme } from "@/components/public/ProgrammeDetail";

const aftercare: Programme = {
  name: "Aftercare",
  age: "Up to 6 years",
  ratio: "1 : 8",
  tagline: "A calm, creative landing pad until you arrive.",
  description:
    "Aftercare is the quiet half of the day. Children who stay past 14:00 have a snack, a calm activity choice, and time to decompress — never a second school day.",
  hours: "14:00 – 17:30",
  meals: "Afternoon snack",
  pillars: [
    { title: "Decompression first", body: "Time outside, quiet corners, and freedom from structured demands. Children need to rest, not perform." },
    { title: "Light support", body: "Optional homework support for older children who already get reading homework." },
    { title: "Creative choice", body: "Art, building, sand, water, garden — children choose, staff support." },
    { title: "Honest pickup", body: "We message you if your child needs an early pickup or seems unwell. No surprises at the door." }
  ],
  daily: [
    { time: "14:00", title: "Quiet welcome", body: "Children arriving from their main programme settle with a book or drawing." },
    { time: "14:30", title: "Snack", body: "Healthy, allergy-safe afternoon snack at the family table." },
    { time: "15:00", title: "Free choice", body: "Garden, sand pit, art table, or quiet reading corner." },
    { time: "16:00", title: "Optional homework", body: "For older children with reading or writing tasks. Always optional." },
    { time: "16:45", title: "Wind down", body: "Songs, story, tidy-up. Calm bodies before the trip home." },
    { time: "17:30", title: "Pickup", body: "Daily note ready on your phone." }
  ],
  faqs: [
    { q: "Is aftercare an add-on or included?", a: "It's a separate billed programme. Families can book full-time, ad hoc, or holiday-only." },
    { q: "Can my child do aftercare without attending the main programme?", a: "Yes — we accept external aftercare placements where space allows." },
    { q: "What happens if I'm running late?", a: "Let us know via the app. We stay until 17:45 at no charge; beyond that, a small late fee applies." }
  ]
};

export const metadata = { title: "Aftercare programme" };
export default function Page() { return <ProgrammeDetail programme={aftercare} />; }
