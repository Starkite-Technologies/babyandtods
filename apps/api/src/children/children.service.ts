import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChildrenService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.child.findMany({
      include: { classroom: true, parent: { include: { user: true } } },
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
      }
    });
    if (!child) throw new NotFoundException("Child not found");
    return child;
  }
}
