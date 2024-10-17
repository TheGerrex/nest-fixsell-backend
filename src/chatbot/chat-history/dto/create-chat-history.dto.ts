import { IsString, IsNotEmpty, IsDate, IsOptional, IsBoolean, IsObject, IsDateString } from 'class-validator';

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

  @IsDateString()
  @IsNotEmpty()
  timestamp: Date;

  @IsBoolean()
  @IsNotEmpty()
  isRead: boolean;

  @IsString()
  @IsNotEmpty()
  messageType: 'text' | 'form';

  @IsOptional()
  @IsObject()
  formData: any;

}
