import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateChatHistoryDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsDate()
  @IsNotEmpty()
  timestamp: Date;
}
