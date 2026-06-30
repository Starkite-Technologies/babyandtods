import { Controller, Delete, Get, Param } from "@nestjs/common";
import { ChildrenService } from "./children.service";

@Controller("children")
export class ChildrenController {
  constructor(private svc: ChildrenService) {}
  @Get() list() { return this.svc.list(); }
  @Get(":id") get(@Param("id") id: string) { return this.svc.get(id); }
  @Delete(":id") delete(@Param("id") id: string) { return this.svc.delete(id); }
}
