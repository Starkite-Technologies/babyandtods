import { Controller, Get, Query } from "@nestjs/common";
import { AuthorizedPickupsService } from "./authorized-pickups.service";

@Controller("authorized-pickups")
export class AuthorizedPickupsController {
  constructor(private svc: AuthorizedPickupsService) {}
  @Get() list(@Query("childId") childId: string) { return this.svc.forChild(childId); }
}
