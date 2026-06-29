import { ProgrammeDetail, type Programme } from "@/components/public/ProgrammeDetail";

const toddlers: Programme = {
  name: "Toddlers",
  age: "18 months – 3 years",
  ratio: "1 : 6",
  tagline: "Confident first steps into language, friendship, and independence.",
  description:
    "Toddlerhood is the wild, brilliant burst when language explodes and the first real friendships form. Our room is set up for movement, song, mess, and gentle independence work.",
  hours: "07:00 – 17:30",
  meals: "Breakfast · Lunch · Snack",
  pillars: [
    { title: "Language-rich", body: "Songs, picture cards, real conversation. We narrate the day so vocabulary grows naturally." },
    { title: "Independence first", body: "Self-serve snack, putting on shoes, washing hands. Small wins build the spine of confidence." },
    { title: "Friendly conflict", body: "We coach turn-taking and feelings rather than scripting them away. Real social skills, not silent rooms." },
    { title: "Outdoor every day", body: "Climbing, balance, sand, water. Big movement is non-negotiable, weather adjusted." }
  ],
  daily: [
    { time: "07:00", title: "Arrival & free play", body: "Soft entry with familiar materials. Settling time is respected." },
    { time: "08:30", title: "Breakfast", body: "Family-style. Children pour, choose, and serve themselves where they can." },
    { time: "09:30", title: "Story circle & songs", body: "Where language lives. Repetition is the point, not the problem." },
    { time: "10:30", title: "Outdoor movement", body: "Sand pit, balance beam, climbing frame, garden play." },
    { time: "11:30", title: "Lunch", body: "Allergies checked twice. Children sit, eat, and chat with their carer." },
    { time: "12:30", title: "Cot rest", body: "Soft music, dim light, comfort items. Awake-rest for non-nappers." },
    { time: "14:30", title: "Art & messy play", body: "Paint, clay, water. The point is the process, not the picture." },
    { time: "17:30", title: "Pickup", body: "Same-day report waiting on your phone. Calm handover." }
  ],
  faqs: [
    { q: "How do you handle potty training?", a: "We follow your lead. When your child shows readiness, we coordinate a consistent approach with home." },
    { q: "What if my toddler doesn't nap?", a: "No pressure. Non-nappers join a quiet, calm activity in a separate corner with a carer." },
    { q: "Do you take children outside in winter?", a: "Yes — every day, weather-appropriate. We provide warm jackets when needed." }
  ]
};

export const metadata = { title: "Toddlers programme" };
export default function Page() { return <ProgrammeDetail programme={toddlers} />; }
