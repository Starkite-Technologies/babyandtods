import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateStaffAccountDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  role!: string;

  @IsOptional()
  @IsString()
  assignedClassroomId?: string;

  @IsOptional()
  @IsString()
  employmentStatus?: string;
}
