import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsUUID,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreatePackageDto {
  @IsUUID()
  @IsNotEmpty()
  printer: string;

  @IsOptional()
  @IsNumber()
  packageDuration?: number;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  packageStartDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsNotEmpty()
  packageEndDate: Date;

  @IsOptional()
  @IsNumber()
  packagePrice?: number;

  @IsOptional()
  @IsNumber()
  packageDiscountPercentage?: number;

  @IsOptional()
  @IsString()
  packageDescription?: string;

  @IsOptional()
  @IsNumber()
  packagePrints?: number;

  @IsOptional()
  @IsNumber()
  packageExtraClickPrice?: number;
}
