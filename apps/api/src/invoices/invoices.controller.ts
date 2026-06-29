import { Controller, Get, Query } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";

@Controller("invoices")
export class InvoicesController {
  constructor(private svc: InvoicesService) {}
  @Get() list(@Query("parentId") parentId?: string) {
    return parentId ? this.svc.forParent(parentId) : this.svc.list();
  }
  @Get("summary") summary() { return this.svc.summary(); }
}
