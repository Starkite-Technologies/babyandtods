import { IsEmail, IsOptional, IsString } from "class-validator";

export class SendInvitationDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
