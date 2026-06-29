import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DailyReportsService {
  constructor(private prisma: PrismaService) {}

  recent() {
    return this.prisma.dailyReport.findMany({
      orderBy: { date: "desc" },
      take: 50,
      include: { child: true, staff: { include: { user: true } } }
    });
  }

  forChild(childId: string) {
    return this.prisma.dailyReport.findMany({
      where: { childId },
      orderBy: { date: "desc" },
      take: 30,
      include: { staff: { include: { user: true } } }
    });
  }
}
