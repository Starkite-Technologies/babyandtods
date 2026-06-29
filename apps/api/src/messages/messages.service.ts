import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}
  threads() {
    return this.prisma.message.findMany({ orderBy: { sentAt: "desc" }, take: 100 });
  }
  thread(id: string) {
    return this.prisma.message.findMany({ where: { threadId: id }, orderBy: { sentAt: "asc" } });
  }
}
