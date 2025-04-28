import {
  IsString,
  IsEmail,
  IsEnum,
  IsArray,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Priority, Status } from '../entities/ticket.entity';
import { Transform } from 'class-transformer';
import { User } from 'src/auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';

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
  assigned: User;

  @IsOptional()
  @IsString()
  assignee: User;

  @IsOptional()
  @IsString()
  issue: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  activities: Activity[];

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

  @IsOptional()
  @IsNumber()
  rating: number;
}
