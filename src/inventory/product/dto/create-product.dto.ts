import {
  IsString,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsDecimal,
  isNumber,
  IsArray,
  IsInt,
} from 'class-validator';
import { ProductCategory } from 'src/inventory/product-categories/entities/product-category.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsBoolean()
  buyable: boolean;

  @IsBoolean()
  sellable: boolean;

  @IsOptional()
  @IsString()
  product_image?: string;

  @IsString()
  product_type: string;

  @IsNumber()
  product_price: number;

  @IsString()
  product_value: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  product_categories?: string[];

  @IsString()
  product_intern_id: string;

  @IsOptional()
  @IsString()
  product_barcode?: string;

  @IsOptional()
  @IsString()
  product_sticker?: string;
}
