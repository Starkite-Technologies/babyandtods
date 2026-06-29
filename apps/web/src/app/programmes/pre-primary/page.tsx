import { ProgrammeDetail, type Programme } from "@/components/public/ProgrammeDetail";

const prePrimary: Programme = {
  name: "Pre-primary",
  age: "3 - 5 years",
  ratio: "1 : 10",
  tagline: "School-ready, not school-anxious.",
  description:
    "Pre-primary is where the rhythms of formal school meet the curiosity of early childhood. Children leave us able to write their name, count confidently, sit through a group lesson - and still love learning.",
  hours: "07:00 - 17:30",
  meals: "Breakfast · Lunch · Snack",
  pillars: [
    { title: "Literacy through play", body: "Letter sounds, mark-making, and read-alouds woven through the day, never drilled." },
    { title: "Number sense", body: "Counting, patterns, sorting, and simple problem solving in real contexts - kitchen, garden, blocks." },
    { title: "Group readiness", body: "Sitting still, raising hands, listening to peers. The unglamorous skills that real classrooms require." },
    { title: "Emotional literacy", body: "Naming feelings, resolving conflicts, and asking for help - taught explicitly, not assumed." }
  ],
  daily: [
    { time: "07:00", title: "Arrival & quiet activities", body: "Books, puzzles, drawing. A gentle start before the day picks up." },
    { time: "08:30", title: "Breakfast & morning meeting", body: "Calendar, weather, and what we're working on today." },
    { time: "09:30", title: "Focused learning", body: "Small-group literacy and numeracy. Twenty minutes, then up and moving." },
    { time: "10:30", title: "Outdoor & PE", body: "Big movement, team games, and free play." },
    { time: "11:30", title: "Lunch", body: "Family-style, with a teacher at each table. We model conversation." },
    { time: "12:30", title: "Rest or quiet work", body: "Mats for resters; quiet tables for non-resters with self-chosen activities." },
    { time: "14:00", title: "Themed project work", body: "Hands-on units: weather, animals, families, our city." },
    { time: "16:00", title: "Free play & wind-down", body: "Choice of indoor or outdoor. Tidy-up routine begins." },
    { time: "17:30", title: "Pickup", body: "Same-day report and weekly learning summary." }
  ],
  faqs: [
    { q: "Do you follow the Namibian school curriculum?", a: "Yes - pre-primary aligns with national learning outcomes, with our own play-based approach to delivery." },
    { q: "Will my child be ready for Grade 1?", a: "Absolutely. Our graduates routinely transition into Grade 1 with strong letter, number, and social skills." },
    { q: "How is screen time handled?", a: "There is no daily screen time. Occasional, intentional use (a short video tied to a project) is communicated in advance." }
  ]
};

export const metadata = { title: "Pre-primary programme" };
export default function Page() { return <ProgrammeDetail programme={prePrimary} />; }
