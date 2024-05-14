import {
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Priority, Status } from '../entities/ticket.entity';
import { Transform } from 'class-transformer';

export class CreateTicketDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  type: string;

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
  clientAddress: string;

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

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  appointmentStartTime: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  appointmentEndTime: Date;
}
