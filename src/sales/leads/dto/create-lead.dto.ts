import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Status, ProductType } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  client: string;

  @IsOptional()
  @IsEnum(Status)
  status: Status;

  @IsOptional()
  assigned: string;

  @IsOptional()
  @IsString()
  product_interested: string;

  @IsOptional()
  @IsEnum(ProductType)
  type_of_product: ProductType;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;
}
