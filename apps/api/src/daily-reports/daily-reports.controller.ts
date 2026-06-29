import { Controller, Get, Param, Query } from "@nestjs/common";
import { DailyReportsService } from "./daily-reports.service";

@Controller("daily-reports")
export class DailyReportsController {
  constructor(private svc: DailyReportsService) {}
  @Get() list(@Query("childId") childId?: string) {
    return childId ? this.svc.forChild(childId) : this.svc.recent();
  }
  @Get("child/:id") forChild(@Param("id") id: string) {
    return this.svc.forChild(id);
  }
}
