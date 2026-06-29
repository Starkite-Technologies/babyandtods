import { Controller, Get } from "@nestjs/common";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private svc: PaymentsService) {}
  @Get() list() { return this.svc.list(); }
}
