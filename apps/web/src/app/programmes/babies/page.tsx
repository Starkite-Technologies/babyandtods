import { ProgrammeDetail, type Programme } from "@/components/public/ProgrammeDetail";

const babies: Programme = {
  name: "Babies",
  age: "3–18 months",
  ratio: "1 : 4",
  tagline: "A safe, predictable, deeply attentive first year.",
  description:
    "The babies room is the quietest, calmest part of the academy. Low ratios, qualified infant carers, and a daily rhythm shaped around each child's own feeding, sleep, and play schedule.",
  hours: "07:00 – 17:30",
  meals: "Bottle / puree / finger",
  pillars: [
    { title: "Bonded care", body: "Each baby has a primary carer who knows their cues, comfort objects, and routines." },
    { title: "Honest logging", body: "Every feed, nappy, and nap is logged the moment it happens — visible to you instantly." },
    { title: "Sensory rich, screen free", body: "Tactile baskets, soft music, mirror work, and outdoor air. Never a screen." },
    { title: "Safe sleep", body: "Cots on monitors. Trained staff. Strict back-to-sleep protocols and visual checks." }
  ],
  daily: [
    { time: "07:00", title: "Drop-off & calm corner", body: "Soft handover with familiar carer. We follow your home morning, not ours." },
    { time: "09:00", title: "Morning feed & rest", body: "Bottles or breakfast as needed. Cot rest for those who arrived early." },
    { time: "10:30", title: "Sensory & floor play", body: "Treasure baskets, tummy time, music, and outside time in the pram." },
    { time: "12:00", title: "Lunch", body: "Pureed or finger food depending on stage. Always sat with a carer." },
    { time: "13:00", title: "Long nap", body: "Cot rest with dimmed light. We do not rush sleep." },
    { time: "15:00", title: "Afternoon snack & play", body: "Songs, cuddles, books, and one-on-one chat." },
    { time: "17:30", title: "Calm pickup", body: "Signed handover with a same-day report ready on your phone." }
  ],
  faqs: [
    { q: "Can I drop off a frozen breastmilk supply?", a: "Yes. We label, store at correct temperature, and only thaw what is needed. Daily counts are returned to you." },
    { q: "How are nap times handled?", a: "We follow your baby's own rhythm. No forced schedule. Sleep is always supervised and logged." },
    { q: "What happens if my baby is unwell?", a: "We call you within ten minutes, share temperature and symptoms, and follow your agreed care plan." }
  ]
};

export const metadata = { title: "Babies programme" };
export default function Page() { return <ProgrammeDetail programme={babies} />; }
