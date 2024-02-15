import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Color } from '../../consumibles/color.enum';
import { Origen } from '../../consumibles/origen.enum';
export class CreateConsumibleDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsNumber()
  price: number;

  @IsString()
  currency: string;

  @IsString()
  sku: string;

  // @IsNumber()
  // weight: number;

  @IsNumber()
  volume: number;

  // origen: string;
  @IsEnum(Origen)
  origen: Origen;

  @IsString()
  longDescription: string;

  @IsString()
  shortDescription: string;

  @IsArray()
  @IsString({ each: true })
  compatibleModels: string[];

  @IsOptional()
  @IsEnum(Color)
  color?: Color;

  @IsNumber()
  yield: number;

  // @IsString()
  // thumbnailImage: string;

  @IsArray()
  @IsString({ each: true })
  img_url: string[];

  @IsString()
  category: string;

  // @IsNumber()
  // stock: number;

  // @IsString()
  // location: string;

  // printers
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  printersIds?: string[];

  @IsOptional()
  @IsUUID()
  counterpartId?: string;
}
