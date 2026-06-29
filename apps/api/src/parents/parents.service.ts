import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ParentsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.parent.findMany({
      include: { user: true, children: true }
    });
  }

  get(id: string) {
    return this.prisma.parent.findUnique({
      where: { id },
      include: { user: true, children: true, invoices: { include: { payments: true } } }
    });
  }
}
