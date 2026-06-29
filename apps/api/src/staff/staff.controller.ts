import { Controller, Get } from "@nestjs/common";
import { StaffService } from "./staff.service";

@Controller("staff")
export class StaffController {
  constructor(private svc: StaffService) {}
  @Get() list() { return this.svc.list(); }
}
