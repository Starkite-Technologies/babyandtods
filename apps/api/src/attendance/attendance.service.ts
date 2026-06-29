import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  today() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return this.prisma.attendance.findMany({
      where: { date: { gte: start, lt: end } },
      include: { child: { include: { classroom: true } } },
      orderBy: { checkedInAt: "asc" }
    });
  }

  forChild(childId: string) {
    return this.prisma.attendance.findMany({
      where: { childId },
      orderBy: { date: "desc" },
      take: 30
    });
  }
}
