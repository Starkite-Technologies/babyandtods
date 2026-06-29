import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.payment.findMany({
      include: { invoice: { include: { parent: { include: { user: true } } } } },
      orderBy: { paidAt: "desc" }
    });
  }
}
