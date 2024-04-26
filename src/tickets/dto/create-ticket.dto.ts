import {
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Priority, Status } from '../entities/ticket.entity';

export class CreateTicketDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  clientName: string;

  @IsOptional()
  @IsEmail()
  clientEmail: string;

  @IsOptional()
  @IsString()
  clientPhone: string;

  @IsOptional()
  @IsString()
  assigned: string;

  @IsOptional()
  @IsString()
  assignee: string;

  @IsOptional()
  @IsString()
  issue: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activity: string;

  @IsOptional()
  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ticketFiles: string[];
}
