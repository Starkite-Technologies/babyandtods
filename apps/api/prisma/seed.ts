import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function days(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function todayAt(h: number, m: number = 0) {
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

async function main() {
  console.log("🌱  Seeding Babies & Todd's Academy database...");

  // Wipe existing
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.message.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.allergy.deleteMany();
  await prisma.authorizedPickup.deleteMany();
  await prisma.healthRecord.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.mediaFile.deleteMany();
  await prisma.child.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.user.deleteMany();

  // Users
  const [maria, tate, johanna, amanda, assumpta, kristina, selma] = await Promise.all([
    prisma.user.create({ data: { email: "maria.shikongo@example.com", name: "Maria Shikongo", role: "parent" } }),
    prisma.user.create({ data: { email: "tate.hamutenya@example.com", name: "Tate Hamutenya", role: "parent" } }),
    prisma.user.create({ data: { email: "johanna@babiesandtods.test", name: "Johanna Festus", role: "teacher" } }),
    prisma.user.create({ data: { email: "amanda@babiesandtods.test", name: "Amanda Kazombaruru", role: "teacher" } }),
    prisma.user.create({ data: { email: "director@babiesandtods.test", name: "Assumpta SM Gahutu", role: "admin" } }),
    prisma.user.create({ data: { email: "kristina@babiesandtods.test", name: "Kristina Bompastoor", role: "teacher" } }),
    prisma.user.create({ data: { email: "selma@babiesandtods.test", name: "Selma Iyambo", role: "teacher" } })
  ]);

  // Parents
  const [pMaria, pTate] = await Promise.all([
    prisma.parent.create({ data: { userId: maria.id, phone: "+264 81 555 0142" } }),
    prisma.parent.create({ data: { userId: tate.id, phone: "+264 81 555 0199" } })
  ]);

  // Staff
  const [sJohanna, sAmanda, sAssumpta, sKristina, sSelma] = await Promise.all([
    prisma.staff.create({ data: { userId: johanna.id, roleTitle: "Lead Teacher · Pre-primary" } }),
    prisma.staff.create({ data: { userId: amanda.id, roleTitle: "Lead Teacher · Toddlers" } }),
    prisma.staff.create({ data: { userId: assumpta.id, roleTitle: "Founder & Director" } }),
    prisma.staff.create({ data: { userId: kristina.id, roleTitle: "Chef & Kitchen Lead" } }),
    prisma.staff.create({ data: { userId: selma.id, roleTitle: "Infant Carer" } })
  ]);

  // Classrooms
  const [sunshine, rainbow, sunbeam, trailblazers] = await Promise.all([
    prisma.classroom.create({ data: { name: "Sunshine", ageGroup: "3 – 4 years", leadStaffId: sJohanna.id } }),
    prisma.classroom.create({ data: { name: "Rainbow", ageGroup: "4 – 5 years", leadStaffId: sAmanda.id } }),
    prisma.classroom.create({ data: { name: "Sunbeam", ageGroup: "3 – 18 months", leadStaffId: sSelma.id } }),
    prisma.classroom.create({ data: { name: "Trailblazers", ageGroup: "5 – 6 years", leadStaffId: sJohanna.id } })
  ]);

  // Children
  const children = await Promise.all([
    prisma.child.create({
      data: { name: "Amara Shikongo", dateOfBirth: new Date("2023-02-14"), classroomId: sunshine.id, parentId: pMaria.id }
    }),
    prisma.child.create({
      data: { name: "Liyana Hamutenya", dateOfBirth: new Date("2022-05-02"), classroomId: rainbow.id, parentId: pTate.id }
    }),
    prisma.child.create({
      data: { name: "Pedro Cassinda", dateOfBirth: new Date("2024-12-11"), classroomId: sunbeam.id, parentId: pMaria.id }
    }),
    prisma.child.create({
      data: { name: "Naima Hangula", dateOfBirth: new Date("2020-07-22"), classroomId: trailblazers.id, parentId: pTate.id }
    }),
    prisma.child.create({
      data: { name: "Junior Hailonga", dateOfBirth: new Date("2022-10-18"), classroomId: sunshine.id, parentId: pMaria.id }
    }),
    prisma.child.create({
      data: { name: "Emma Nashilongo", dateOfBirth: new Date("2023-08-04"), classroomId: sunshine.id, parentId: pTate.id }
    }),
    prisma.child.create({
      data: { name: "Tomas Kavari", dateOfBirth: new Date("2021-11-29"), classroomId: rainbow.id, parentId: pMaria.id }
    })
  ]);

  // Attendance today
  await Promise.all([
    prisma.attendance.create({ data: { childId: children[0].id, date: todayAt(0), status: "checked-in", checkedInAt: todayAt(8, 12) } }),
    prisma.attendance.create({ data: { childId: children[1].id, date: todayAt(0), status: "checked-in", checkedInAt: todayAt(7, 58) } }),
    prisma.attendance.create({ data: { childId: children[2].id, date: todayAt(0), status: "absent" } }),
    prisma.attendance.create({ data: { childId: children[3].id, date: todayAt(0), status: "picked-up", checkedInAt: todayAt(8, 4), checkedOutAt: todayAt(13, 45) } }),
    prisma.attendance.create({ data: { childId: children[4].id, date: todayAt(0), status: "checked-in", checkedInAt: todayAt(8, 31) } }),
    prisma.attendance.create({ data: { childId: children[5].id, date: todayAt(0), status: "checked-in", checkedInAt: todayAt(7, 49) } }),
    prisma.attendance.create({ data: { childId: children[6].id, date: todayAt(0), status: "checked-in", checkedInAt: todayAt(8, 21) } })
  ]);

  // Daily reports
  await Promise.all([
    prisma.dailyReport.create({
      data: {
        childId: children[0].id, staffId: sJohanna.id, date: todayAt(0),
        meals: "Oats + fruit; finished lunch",
        nap: "1h 10m",
        learningNote: "Recognized three new picture cards. Shared blocks with a friend.",
        status: "approved"
      }
    }),
    prisma.dailyReport.create({
      data: {
        childId: children[1].id, staffId: sAmanda.id, date: todayAt(0),
        meals: "Breakfast & snack complete",
        nap: "45m",
        learningNote: "Strong letter recognition in small group work.",
        status: "ready"
      }
    }),
    prisma.dailyReport.create({
      data: {
        childId: children[4].id, staffId: sJohanna.id, date: todayAt(0),
        meals: "Ate well",
        nap: "1h 20m",
        learningNote: "Built a tall block tower and counted steps aloud.",
        status: "ready"
      }
    }),
    prisma.dailyReport.create({
      data: {
        childId: children[3].id, staffId: sJohanna.id, date: todayAt(0),
        meals: "Lunch finished",
        nap: "Quiet rest",
        learningNote: "Practiced pencil grip and wrote her first name twice.",
        status: "sent"
      }
    })
  ]);

  // Allergies
  await Promise.all([
    prisma.allergy.create({ data: { childId: children[0].id, allergen: "Peanuts", severity: "severe", notes: "Nut-free meal plan; kitchen alert active." } }),
    prisma.allergy.create({ data: { childId: children[2].id, allergen: "Dairy", severity: "moderate", notes: "Lactose-free bottle only." } }),
    prisma.allergy.create({ data: { childId: children[1].id, allergen: "Dust", severity: "mild", notes: "Monitor during windy outdoor play." } })
  ]);

  // Incidents
  await Promise.all([
    prisma.incident.create({ data: { childId: children[1].id, date: days(3), summary: "Small scrape during outdoor play. Cleaned and parent notified.", severity: "low" } }),
    prisma.incident.create({ data: { childId: children[0].id, date: days(9), summary: "Allergy lunch check completed before serving.", severity: "low" } })
  ]);

  // Authorized pickups
  await Promise.all([
    prisma.authorizedPickup.create({ data: { childId: children[0].id, name: "Maria Shikongo", relationship: "Mother", phone: "+264 81 555 0142" } }),
    prisma.authorizedPickup.create({ data: { childId: children[0].id, name: "Daniel Shikongo", relationship: "Father", phone: "+264 81 555 0143" } }),
    prisma.authorizedPickup.create({ data: { childId: children[0].id, name: "Ester Nambala", relationship: "Aunt", phone: "+264 81 555 0188" } }),
    prisma.authorizedPickup.create({ data: { childId: children[1].id, name: "Tate Hamutenya", relationship: "Father", phone: "+264 81 555 0199" } })
  ]);

  // Announcements
  await Promise.all([
    prisma.announcement.create({ data: { title: "Winter wellness week", body: "Please pack a warm jersey and labeled water bottle for outdoor movement.", audience: "all" } }),
    prisma.announcement.create({ data: { title: "Parent-teacher chats", body: "Sunshine class check-ins are available from Monday afternoon.", audience: "parent" } }),
    prisma.announcement.create({ data: { title: "Fire drill practice", body: "Staff will run a calm evacuation practice this week.", audience: "teacher" } }),
    prisma.announcement.create({ data: { title: "Now enrolling 2027 term", body: "Limited places open across all programmes for next academic year.", audience: "all" } })
  ]);

  // Invoices
  await Promise.all([
    prisma.invoice.create({ data: { parentId: pMaria.id, amount: 1950, dueDate: days(-1), status: "paid" } }),
    prisma.invoice.create({ data: { parentId: pTate.id, amount: 2250, dueDate: days(-3), status: "pending" } }),
    prisma.invoice.create({ data: { parentId: pMaria.id, amount: 1650, dueDate: days(9), status: "overdue" } }),
    prisma.invoice.create({ data: { parentId: pTate.id, amount: 2450, dueDate: days(-4), status: "pending" } })
  ]);

  const paid = await prisma.invoice.findFirst({ where: { status: "paid" } });
  if (paid) {
    await prisma.payment.create({ data: { invoiceId: paid.id, amount: 1950, paidAt: days(6), method: "EFT" } });
  }

  // Messages (a single thread between Maria & Johanna)
  await prisma.message.createMany({
    data: [
      { threadId: "thread-sunshine", senderId: sJohanna.id, body: "Amara settled quickly and joined story circle with confidence.", sentAt: todayAt(10, 35) },
      { threadId: "thread-sunshine", senderId: pMaria.id, body: "Thank you. We will collect at 15:30 today.", sentAt: todayAt(13, 12) },
      { threadId: "thread-sunshine", senderId: sJohanna.id, body: "Noted. We will have her ready at reception.", sentAt: todayAt(13, 18) }
    ]
  });

  console.log("✅  Seed complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
