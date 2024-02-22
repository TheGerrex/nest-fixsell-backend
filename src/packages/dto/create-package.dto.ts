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
  @IsOptional()
  packageStartDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @IsOptional()
  packageEndDate: Date;

  @IsOptional()
  @IsNumber()
  packagePrice?: number;

  @IsOptional()
  @IsString()
  packageCurrency?: string;

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

  @IsOptional()
  @IsNumber()
  packageDepositPrice?: number;

  @IsOptional()
  @IsString({ each: true })
  packageIncludes?: string[];
}
