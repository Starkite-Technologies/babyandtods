import { Controller, Get, Param } from "@nestjs/common";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController {
  constructor(private svc: MessagesService) {}
  @Get() list() { return this.svc.threads(); }
  @Get(":threadId") thread(@Param("threadId") id: string) { return this.svc.thread(id); }
}
