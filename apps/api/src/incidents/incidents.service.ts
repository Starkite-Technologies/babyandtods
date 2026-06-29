import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.incident.findMany({ include: { child: true }, orderBy: { date: "desc" } });
  }
}
