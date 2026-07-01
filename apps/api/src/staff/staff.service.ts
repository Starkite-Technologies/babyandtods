import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.staff.findMany({
      include: { user: true, classrooms: true },
      relationLoadStrategy: "join",
      orderBy: { roleTitle: "asc" }
    });
  }
}
