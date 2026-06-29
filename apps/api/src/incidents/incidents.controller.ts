import { Controller, Get } from "@nestjs/common";
import { IncidentsService } from "./incidents.service";

@Controller("incidents")
export class IncidentsController {
  constructor(private svc: IncidentsService) {}
  @Get() list() { return this.svc.list(); }
}
