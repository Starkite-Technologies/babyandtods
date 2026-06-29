import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateAnnouncementDto {
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
