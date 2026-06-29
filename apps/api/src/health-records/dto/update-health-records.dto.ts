import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateHealthRecordDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}
