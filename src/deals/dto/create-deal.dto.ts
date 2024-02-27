import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsUUID,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateDealDto {
  @IsUUID()
  @IsOptional()
  printer: string;

  @IsUUID()
  @IsOptional()
  consumible: string;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  dealStartDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  dealEndDate: Date;

  @IsNumber()
  @IsOptional()
  dealPrice: number;

  @IsString()
  @IsOptional()
  dealCurrency: string;

  @IsNumber()
  @IsOptional()
  dealDiscountPercentage: number;

  @IsString()
  @IsOptional()
  dealDescription: string;
}
