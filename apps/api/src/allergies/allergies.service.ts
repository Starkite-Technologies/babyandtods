import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AllergiesService {
  constructor(private prisma: PrismaService) {}
  list() {
    return this.prisma.allergy.findMany({ include: { child: true }, orderBy: { severity: "desc" } });
  }
}
