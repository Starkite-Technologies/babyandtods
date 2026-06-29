import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateAnnouncementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  audience?: string;

  @IsOptional()
  @IsDateString()
  publishAt?: string;
}
