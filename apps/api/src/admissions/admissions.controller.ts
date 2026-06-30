import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdmissionsService } from "./admissions.service";

@Controller("admissions")
export class AdmissionsController {
  constructor(private svc: AdmissionsService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.svc.create(body);
  }

  @Get()
  list(@Query("status") status?: string) {
    return this.svc.list(status);
  }

  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body() body: { status?: string; adminNote?: string }) {
    return this.svc.updateStatus(id, body);
  }

  @Patch(":id/enrol")
  enrol(@Param("id") id: string, @Body() body: { classroomId?: string; preferredStart?: string }) {
    return this.svc.enrol(id, body);
  }

  @Delete()
  clear() {
    return this.svc.clear();
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.svc.delete(id);
  }
}
