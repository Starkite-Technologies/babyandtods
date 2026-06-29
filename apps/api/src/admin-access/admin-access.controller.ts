import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { AdminAccessService } from "./admin-access.service";
import { CreateParentAccountDto } from "./dto/create-parent-account.dto";
import { CreateStaffAccountDto } from "./dto/create-staff-account.dto";
import { SendInvitationDto } from "./dto/send-invitation.dto";

@Controller("admin-access")
export class AdminAccessController {
  constructor(private readonly service: AdminAccessService) {}

  @Get()
  summary() {
    return this.service.summary();
  }

  @Post("staff")
  createStaff(@Body() body: CreateStaffAccountDto) {
    return this.service.createStaffAccount(body);
  }

  @Post("parents")
  createParent(@Body() body: CreateParentAccountDto) {
    return this.service.createParentAccount(body);
  }

  @Post("invitations/send")
  sendInvitation(@Body() body: SendInvitationDto) {
    return this.service.sendInvitation(body);
  }

  @Patch("users/:id/verify")
  verify(@Param("id") id: string) {
    return this.service.verifyUser(id);
  }

  @Patch("users/:id/suspend")
  suspend(@Param("id") id: string) {
    return this.service.suspendUser(id);
  }

  @Patch("users/:id/restore")
  restore(@Param("id") id: string) {
    return this.service.restoreUser(id);
  }
}
