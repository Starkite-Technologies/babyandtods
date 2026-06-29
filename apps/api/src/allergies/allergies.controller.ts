import { Controller, Get } from "@nestjs/common";
import { AllergiesService } from "./allergies.service";

@Controller("allergies")
export class AllergiesController {
  constructor(private svc: AllergiesService) {}
  @Get() list() { return this.svc.list(); }
}
