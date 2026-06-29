import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { AttendanceStatus } from "../../common/enums";

export class CreateAttendanceDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsString()
  classroomId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;

  @IsOptional()
  @IsDateString()
  checkedInAt?: string;

  @IsOptional()
  @IsDateString()
  checkedOutAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
