import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthorizedPickupsService {
  constructor(private prisma: PrismaService) {}
  forChild(childId: string) {
    return this.prisma.authorizedPickup.findMany({ where: { childId } });
  }
}
