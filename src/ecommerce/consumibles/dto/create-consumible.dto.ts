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

  @IsOptional()
  @IsString()
  sku: string;

  @IsOptional()
  @IsNumber()
  volume: number;

  // origen: string;
  @IsOptional()
  @IsEnum(Origen)
  origen: Origen;

  @IsOptional()
  @IsString()
  longDescription: string;

  @IsOptional()
  @IsString()
  shortDescription: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  compatibleModels: string[];

  @IsOptional()
  @IsOptional()
  @IsEnum(Color)
  color?: Color;

  @IsOptional()
  @IsNumber()
  yield: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  img_url: string[];

  @IsOptional()
  @IsString()
  category: string;

  // printers
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  printersIds?: string[];

  @IsOptional()
  @IsUUID(4, { each: true })
  counterpartIds?: string[];
}
