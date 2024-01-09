import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDecimal,
    IsIn,
    IsOptional,
    IsPositive,
    IsString,
    IsUrl,
    Min,
  } from 'class-validator';
  
  const brands = ['konica minolta', 'kyocera', 'epson'];
  const categories = [
    'oficina',
    'produccion',
    'inyeccion de tinta',
    'artes graficas',
    'etiquetas',
  ];

  const printSizes = ["carta", "doble carta", "tabloide", "tabloide plus", "legal", "rollo 4", "rollo 4.25", "rollo 8", "rollo 8.34", "rollo 13", ]
  const printVelocity = ["24-30", "30-40", "40-50", "50-60", "60-80", "80-100", "100+"]
  
  export class FilterPrinterDto {

    @IsOptional()
    @IsPositive()
    @Type(() => Number) //enableImplicitConversions: true
    limit?: number;

    @IsOptional()
    @Min(0)
    @Type(() => Number) //enableImplicitConversions: true
    offset?: number;

    @IsIn(brands, { each: true })
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().split(',') : value)
    brand?: string[];
  
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    model?: string;
  
    @IsOptional()
    @IsDecimal()
    price?: number;
  
    @IsIn(categories, { each: true })
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().split(',') : value)
    category?: string[];
  
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    color?: boolean;
  
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    })
    rentable?: boolean;
  
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return undefined;
    })
    sellable?: boolean;
  
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @Transform(({ value }) => value.toLowerCase())
    tags?: string[];
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    powerConsumption?: string;
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    dimensions?: string;
  
    // @IsIn(printVelocity, { each: true })
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().split(',') : value)
    printVelocity?: string[];
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    maxPrintSizeSimple?: string;
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    maxPrintSize?: string;

    @IsIn(printSizes, { each: true })
    @IsString({ each: true })
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.toLowerCase().split(',') : value)
    printSize?: string[];
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    maxPaperWeight?: string;
  
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    duplexUnit?: boolean;
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    paperSizes?: string;
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    applicableOS?: string;
  
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    printerFunctions?: string;
  
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    @Transform(({ value }) => value.toLowerCase())
    barcode?: string[];
  }
  