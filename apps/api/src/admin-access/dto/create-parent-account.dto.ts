import { IsBoolean, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateParentAccountDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  relationshipToChild!: string;

  @IsOptional()
  @IsString()
  linkedChildId?: string;

  @IsOptional()
  @IsBoolean()
  pickupPermission?: boolean;

  @IsOptional()
  @IsString()
  emergencyContactStatus?: string;
}
