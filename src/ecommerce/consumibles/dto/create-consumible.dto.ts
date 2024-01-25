import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateConsumibleDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  weight: number;

  @IsString()
  longDescription: string;

  @IsString()
  shortDescription: string;

  @IsString()
  thumbnailImage: string;

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsString()
  category: string;

  @IsNumber()
  stock: number;

  @IsString()
  location: string;
}
