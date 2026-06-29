import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../common/enums";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  phone?: string;
}
