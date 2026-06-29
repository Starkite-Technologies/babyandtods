import { Controller, Get } from "@nestjs/common";
import { ClassroomsService } from "./classrooms.service";

@Controller("classrooms")
export class ClassroomsController {
  constructor(private svc: ClassroomsService) {}
  @Get() list() { return this.svc.list(); }
}
