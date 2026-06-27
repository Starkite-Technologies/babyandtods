import type { DashboardStat, InvoiceSummary, Learner } from "@babies-tods/shared";

export const learners: Learner[] = [
  {
    id: "amara",
    name: "Amara Shikongo",
    age: "3y 4m",
    classroom: "Sunshine",
    guardian: "Mrs. Shikongo",
    parentIds: ["parent-shikongo"],
    status: "checked-in"
  },
  {
    id: "liyana",
    name: "Liyana Hamutenya",
    age: "4y 1m",
    classroom: "Rainbow",
    guardian: "Mr. Hamutenya",
    parentIds: ["parent-hamutenya"],
    status: "checked-in"
  },
  {
    id: "pedro",
    name: "Pedro Cassinda",
    age: "1y 6m",
    classroom: "Sunbeam",
    guardian: "Ms. Cassinda",
    parentIds: ["parent-cassinda"],
    status: "absent"
  },
  {
    id: "naima",
    name: "Naima Hangula",
    age: "5y 11m",
    classroom: "Trailblazers",
    guardian: "Mrs. Hangula",
    parentIds: ["parent-hangula"],
    status: "picked-up"
  }
];

export const parentStats: DashboardStat[] = [
  { label: "Today", value: "Checked in", detail: "08:12 by approved guardian", tone: "success" },
  { label: "Learning", value: "86%", detail: "Weekly milestone progress" },
  { label: "Messages", value: "3", detail: "Teacher updates waiting", tone: "warning" },
  { label: "Balance", value: "N$ 0", detail: "June account settled", tone: "success" }
];

export const teacherStats: DashboardStat[] = [
  { label: "Class attendance", value: "23 / 25", detail: "Sunshine class today", tone: "success" },
  { label: "Daily reports", value: "18", detail: "7 still in progress", tone: "warning" },
  { label: "Incidents", value: "0", detail: "No open safety notes", tone: "success" },
  { label: "Messages", value: "6", detail: "Parent conversations" }
];

export const adminStats: DashboardStat[] = [
  { label: "Learners", value: "77", detail: "Across 5 classrooms", tone: "success" },
  { label: "Staff", value: "8", detail: "1 open assistant role" },
  { label: "Revenue", value: "N$ 154k", detail: "June projected fees", tone: "success" },
  { label: "Compliance", value: "92%", detail: "First-aid renewals pending", tone: "warning" }
];

export const invoices: InvoiceSummary[] = [
  { id: "INV-1041", family: "Shikongo family", amount: "N$ 1,950", dueDate: "28 Jun", status: "paid" },
  { id: "INV-1042", family: "Hamutenya family", amount: "N$ 2,250", dueDate: "30 Jun", status: "pending" },
  { id: "INV-1043", family: "Cassinda family", amount: "N$ 1,650", dueDate: "18 Jun", status: "overdue" }
];

export const timeline = [
  { time: "08:12", title: "Arrived and settled", detail: "Warm handover at Sunshine class." },
  { time: "09:30", title: "Story circle", detail: "Recognized three new picture cards." },
  { time: "12:15", title: "Lunch", detail: "Ate well. Allergy note checked by kitchen." },
  { time: "14:00", title: "Rest time", detail: "Calm nap period with soft music." }
];

export const staffRows = [
  ["Assumpta SM Gahutu", "Founder & Director", "52h", "Active"],
  ["Johanna Festus", "Teacher & Supervisor", "45h", "Renewal soon"],
  ["Amanda Kazombaruru", "Teacher", "43h", "Active"],
  ["Kristina Bompastoor", "Chef & General Assistant", "42h", "Active"]
];

export const publicPages = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programmes", label: "Programmes" },
  { href: "/admissions", label: "Admissions" },
  { href: "/fees", label: "Fees" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" }
];
