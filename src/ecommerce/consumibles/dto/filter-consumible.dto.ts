import { Transform, Type } from 'class-transformer';
import { Origen } from '../origen.enum';
import { Color } from '../color.enum';
import {
  IsDecimal,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';


// const brands = ['konica minolta', 'kyocera', 'epson', 'audley', 'prixato'];
// const categories = [
//   'oficina',
//   'produccion',
//   'inyeccion de tinta',
//   'artes graficas',
//   'etiquetas',
//   'plotter',
// ];

export class FilterConsumibleDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    name?: string;

    // @IsIn(brands, { each: true })
    @IsString({ each: true })
    @IsOptional()
    brand?: string;

    @IsOptional()
    @IsDecimal()
    price?: number;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    sku?: string;

    @IsEnum(Origen)
    @IsOptional()
    origen?: Origen;

    @IsOptional()
    @IsDecimal()
    volume?: number;
    
    @IsString({ each: true })
    @IsOptional()
    compatibleModels?: string[];

    @IsEnum(Color)
    @IsOptional()
    color?: Color;

    @IsInt()
    @IsOptional()
    yield?: number;

    // @IsIn(categories, { each: true })
    @IsString()
    @IsOptional()
    category?: string;
}