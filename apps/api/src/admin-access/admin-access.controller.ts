import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { AdminAccessService } from "./admin-access.service";
import { CreateStaffAccountDto } from "./dto/create-staff-account.dto";
import { SendInvitationDto } from "./dto/send-invitation.dto";

@Controller("admin-access")
export class AdminAccessController {
  constructor(private readonly service: AdminAccessService) {}

  @Get()
  summary() {
    return this.service.summary();
  }

  @Get("accounts")
  accounts(
    @Query("type") type?: string,
    @Query("status") status?: string,
    @Query("search") search?: string,
    @Query("page") page?: string,
    @Query("take") take?: string
  ) {
    return this.service.listAccounts({
      type,
      status,
      search,
      page: page ? Number(page) : undefined,
      take: take ? Number(take) : undefined
    });
  }

  @Get("users/:id")
  profile(@Param("id") id: string) {
    return this.service.getUserProfile(id);
  }

  @Post("staff")
  createStaff(@Body() body: CreateStaffAccountDto) {
    return this.service.createStaffAccount(body);
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

  @Delete("users/:id/onboarding")
  cancelOnboarding(@Param("id") id: string) {
    return this.service.cancelParentOnboarding(id);
  }

  @Delete("users/:id")
  delete(@Param("id") id: string) {
    return this.service.deleteUser(id);
  }
}
