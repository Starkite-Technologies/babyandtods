import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.classroom.findMany({
      include: {
        leadStaff: { include: { user: true } },
        children: true
      },
      orderBy: { name: "asc" }
    });
  }
}
