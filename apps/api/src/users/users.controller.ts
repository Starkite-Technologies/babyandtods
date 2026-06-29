import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private svc: UsersService) {}
  @Get() list() { return this.svc.list(); }
  @Get(":id") get(@Param("id") id: string) { return this.svc.get(id); }
}
