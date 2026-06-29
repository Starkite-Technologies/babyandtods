import { Module } from "@nestjs/common";
import { AuthorizedPickupsController } from "./authorized-pickups.controller";
import { AuthorizedPickupsService } from "./authorized-pickups.service";

@Module({ controllers: [AuthorizedPickupsController], providers: [AuthorizedPickupsService] })
export class AuthorizedPickupsModule {}
