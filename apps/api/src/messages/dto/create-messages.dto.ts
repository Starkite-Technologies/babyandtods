import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { MessageSenderType } from "../../common/enums";

export class CreateMessageDto {
  @IsOptional()
  @IsString()
  threadId?: string;

  @IsOptional()
  @IsEnum(MessageSenderType)
  senderType?: MessageSenderType;

  @IsOptional()
  @IsString()
  senderId?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsDateString()
  sentAt?: string;
}
