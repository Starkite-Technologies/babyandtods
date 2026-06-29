import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { EmailModule } from "../email/email.module";
import { AdminAccessController } from "./admin-access.controller";
import { AdminAccessService } from "./admin-access.service";

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [AdminAccessController],
  providers: [AdminAccessService]
})
export class AdminAccessModule {}
