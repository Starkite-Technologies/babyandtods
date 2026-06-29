import { Controller, Post, Body, Get, Headers, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { AcceptInvitationDto } from "./dto/accept-invitation.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post("accept-invitation")
  async acceptInvitation(@Body() dto: AcceptInvitationDto) {
    return this.authService.acceptInvitation(dto.token, dto.password);
  }

  @Get("me")
  async me(@Headers("authorization") authHeader?: string) {
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) throw new UnauthorizedException("No token provided");
    const payload = this.authService.verifyToken(token);
    if (!payload) throw new UnauthorizedException("Invalid or expired token");
    return payload;
  }
}
