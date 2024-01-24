import {
  IsOptional,
  IsString,
  IsNumber,
  IsInt,
  isString,
} from 'class-validator';

export class CreateProductOperationsLogisticDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  routes?: string;

  @IsString()
  product_responsable: string;

  @IsNumber()
  product_weight: number;

  @IsNumber()
  product_volume: number;

  @IsInt()
  product_delivery_time: number;
}
