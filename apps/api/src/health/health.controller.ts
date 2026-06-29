import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Controller("health")
export class HealthController {
  constructor(private prisma: PrismaService) {}
  @Get()
  async check() {
    let db: "ok" | "error" = "ok";
    try {
      await this.prisma.$queryRawUnsafe("SELECT 1");
    } catch (error) {
      db = "error";
      // eslint-disable-next-line no-console
      console.error("[health] database check failed", error);
    }
    return { status: db === "ok" ? "ok" : "degraded", db, time: new Date().toISOString() };
  }
}
