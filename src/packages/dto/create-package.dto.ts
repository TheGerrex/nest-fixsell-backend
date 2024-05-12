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
  packageStartDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  packageEndDate: Date;

  @IsOptional()
  @IsNumber()
  packageMonthlyPrice?: number;

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
  packagePrintsBw?: number;

  @IsOptional()
  @IsNumber()
  packagePrintsColor?: number;

  @IsOptional()
  @IsNumber()
  packageExtraClickPriceBw?: number;

  @IsOptional()
  @IsNumber()
  packageExtraClickPriceColor?: number;

  @IsOptional()
  @IsNumber()
  packageDepositPrice?: number;

  @IsOptional()
  @IsString({ each: true })
  packageIncludes?: string[];
}
