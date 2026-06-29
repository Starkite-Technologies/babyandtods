import { Controller, Get, Param, Query } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";

@Controller("attendance")
export class AttendanceController {
  constructor(private svc: AttendanceService) {}
  @Get() list(@Query("childId") childId?: string) {
    return childId ? this.svc.forChild(childId) : this.svc.today();
  }
  @Get("child/:id") forChild(@Param("id") id: string) {
    return this.svc.forChild(id);
  }
}
