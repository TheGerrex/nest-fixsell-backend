import {
  IsString,
  IsDateString,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from '../entities/sale-communication.entity';

export class CreateSaleCommunicationDto {
  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(Type)
  type: Type;

  @IsOptional()
  @IsString()
  notes: string;

  @IsOptional()
  @IsNumber()
  leadId: number;
}
