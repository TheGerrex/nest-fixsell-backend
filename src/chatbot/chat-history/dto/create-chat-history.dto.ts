import { IsString, IsNotEmpty, IsDate, IsOptional } from 'class-validator';

export class CreateChatHistoryDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  senderName: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDate()
  @IsNotEmpty()
  timestamp: Date;
}
