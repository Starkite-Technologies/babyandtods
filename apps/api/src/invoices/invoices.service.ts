import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.invoice.findMany({
      include: { parent: { include: { user: true } }, payments: true },
      orderBy: { dueDate: "desc" }
    });
  }

  forParent(parentId: string) {
    return this.prisma.invoice.findMany({
      where: { parentId },
      include: { payments: true },
      orderBy: { dueDate: "desc" }
    });
  }

  async summary() {
    const invoices = await this.prisma.invoice.findMany({ include: { payments: true } });
    const total = invoices.reduce((acc, i) => acc + Number(i.amount), 0);
    const paid = invoices.filter((i) => i.status === "paid").reduce((a, i) => a + Number(i.amount), 0);
    const pending = invoices.filter((i) => i.status === "pending").reduce((a, i) => a + Number(i.amount), 0);
    const overdue = invoices.filter((i) => i.status === "overdue").reduce((a, i) => a + Number(i.amount), 0);
    return { total, paid, pending, overdue, count: invoices.length };
  }
}
