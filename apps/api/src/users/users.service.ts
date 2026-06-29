import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  list() { return this.prisma.user.findMany({ orderBy: { name: "asc" } }); }
  get(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        parent: { include: { children: true, invoices: true } },
        staff: { include: { classrooms: true } }
      }
    });
  }
}
