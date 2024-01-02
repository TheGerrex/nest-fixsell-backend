import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { Status } from '../entities/reception.entity';

export class CreateReceptionDto {
  @IsString()
  receive_from: string;

  @IsString()
  operation_type: string;

  @IsDateString()
  expected_date: Date;

  @IsString()
  document_origin: string;

  @IsArray()
  @IsString({ each: true })
  products: string[];

  @IsString()
  responsible: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(Status)
  status: Status;
}
