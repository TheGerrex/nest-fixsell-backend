import {
  IsUUID,
  IsNumber,
  IsString,
  IsEnum,
  IsEmail,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  amount: number;

  @IsString()
  shippingName: string;

  @IsString()
  shippingAddress1: string;

  @IsString()
  shippingAddress2: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zip: string;

  @IsString()
  country: string;

  @IsString()
  phone: string;

  @IsEnum(['pending', 'processing', 'shipped', 'delivered'])
  status: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  shipped: boolean;

  @IsOptional()
  @IsString()
  trackingNumber: string;
}
