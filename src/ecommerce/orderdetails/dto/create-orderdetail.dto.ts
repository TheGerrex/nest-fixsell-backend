import { IsUUID, IsNumber, IsString } from 'class-validator';

export class CreateOrderdetailDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}
