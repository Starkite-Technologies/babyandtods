import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateDailyReportDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsString()
  staffId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsString()
  mealsSummary?: string;

  @IsOptional()
  @IsString()
  napSummary?: string;

  @IsOptional()
  @IsString()
  learningNote?: string;

  @IsOptional()
  @IsString()
  activityNote?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
