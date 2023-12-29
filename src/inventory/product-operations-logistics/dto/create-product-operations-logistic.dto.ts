import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateProductOperationsLogisticDto {
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
