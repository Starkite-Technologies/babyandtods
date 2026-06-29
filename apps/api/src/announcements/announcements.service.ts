import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}
  list(audience?: string) {
    return this.prisma.announcement.findMany({
      where: audience ? { OR: [{ audience }, { audience: "all" }] } : undefined,
      orderBy: { createdAt: "desc" }
    });
  }
}
