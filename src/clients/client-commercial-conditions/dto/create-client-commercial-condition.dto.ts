import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { Currency } from '../../interfaces/currency.enum';
import { DayOfWeek } from '../../interfaces/dayofweek.enum';

export class CreateClientCommercialConditionDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsUUID()
  @IsOptional()
  assignedExecutiveId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  creditDays?: number;

  @IsUUID()
  @IsOptional()
  collectionExecutiveId?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  creditLimit?: number;

  @IsBoolean()
  @IsOptional()
  isActiveClient?: boolean;

  @IsBoolean()
  @IsOptional()
  applyVatWithholding?: boolean;

  @IsBoolean()
  @IsOptional()
  validateCreditLimitInSales?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  collectionObservations?: string;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsArray()
  @IsOptional()
  @IsEnum(DayOfWeek, { each: true })
  reviewDays?: DayOfWeek[];

  @IsArray()
  @IsOptional()
  @IsEnum(DayOfWeek, { each: true })
  paymentDays?: DayOfWeek[];
}
