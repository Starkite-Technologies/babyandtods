import { Controller, Get, Param } from "@nestjs/common";
import { ParentsService } from "./parents.service";

@Controller("parents")
export class ParentsController {
  constructor(private svc: ParentsService) {}
  @Get() list() { return this.svc.list(); }
  @Get(":id") get(@Param("id") id: string) { return this.svc.get(id); }
}
