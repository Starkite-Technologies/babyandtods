import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.child.findMany({
      include: { classroom: true, parent: { include: { user: true } } },
      // Fetch the related classroom/parent/user in one SQL query (a join)
      // instead of Prisma's default of one extra round trip per relation.
      // On a connection where each round trip costs ~1s, that turned a
      // 2-relation query into ~2s all by itself.
      relationLoadStrategy: "join",
      orderBy: { name: "asc" }
    });
  }

  async get(id: string) {
    const child = await this.prisma.child.findUnique({
      where: { id },
      include: {
        classroom: true,
        parent: { include: { user: true } },
        attendanceRecords: { orderBy: { date: "desc" }, take: 30 },
        dailyReports: { orderBy: { date: "desc" }, take: 30 },
        authorizedPickups: true,
        allergies: true,
        incidents: { orderBy: { date: "desc" } },
        healthRecords: true,
        mediaFiles: { orderBy: { createdAt: "desc" }, take: 24 }
      },
      // This one has 7 relations. At ~1s per relation round trip that was
      // a ~7s page load — a single joined query collapses it back to
      // roughly the cost of one round trip.
      relationLoadStrategy: "join"
    });
    if (!child) throw new NotFoundException("Child not found");
    return child;
  }

  async delete(id: string) {
    const child = await this.prisma.child.findUnique({ where: { id } });
    if (!child) throw new NotFoundException("Child not found");

    await this.prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { childId: id } });
      await tx.dailyReport.deleteMany({ where: { childId: id } });
      await tx.authorizedPickup.deleteMany({ where: { childId: id } });
      await tx.healthRecord.deleteMany({ where: { childId: id } });
      await tx.allergy.deleteMany({ where: { childId: id } });
      await tx.incident.deleteMany({ where: { childId: id } });
      await tx.mediaFile.deleteMany({ where: { childId: id } });
      await tx.child.delete({ where: { id } });
    });

    return { ok: true };
  }
}
