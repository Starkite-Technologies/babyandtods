import { Controller, Get, Query } from "@nestjs/common";
import { AnnouncementsService } from "./announcements.service";

@Controller("announcements")
export class AnnouncementsController {
  constructor(private svc: AnnouncementsService) {}
  @Get() list(@Query("audience") audience?: string) { return this.svc.list(audience); }
}
