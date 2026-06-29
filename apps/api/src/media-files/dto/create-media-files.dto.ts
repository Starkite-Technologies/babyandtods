import { IsEnum, IsOptional, IsString } from "class-validator";
import { MediaType } from "../../common/enums";

export class CreateMediaFileDto {
  @IsOptional()
  @IsString()
  childId?: string;

  @IsOptional()
  @IsEnum(MediaType)
  type?: MediaType;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}
