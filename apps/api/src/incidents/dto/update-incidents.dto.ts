import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { IncidentSeverity } from "../../common/enums";

export class UpdateIncidentDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsEnum(IncidentSeverity)
  severity?: IncidentSeverity;

  @IsOptional()
  @IsString()
  actionTaken?: string;
}
