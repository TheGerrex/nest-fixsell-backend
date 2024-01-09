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
  
  const brands = ['Konica Minolta', 'Kyocera', 'Epson'];
  const categories = [
    'Oficina',
    'Produccion',
    'Inyección de Tinta',
    'Artes Gráficas',
    'Etiquetas',
  ];

  const paperSizes = ["Carta", "Doble Carta", "Tabloide", "Tabloide +", "Legal", "Rollo 4", "Rollo 4.25", "Rollo 8", "Rollo 8.34", "Rollo 13", ]
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

    @IsIn(brands)
    @IsString()
    @IsOptional()
    brand?: string;
  
    @IsString()
    @IsOptional()
    model?: string;
  
    @IsOptional()
    @IsDecimal()
    price?: number;
  
    @IsOptional()
    @IsIn(categories)
    @IsString()
    category?: string;
  
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
    tags?: string[];
  
    @IsOptional()
    @IsString()
    powerConsumption?: string;
  
    @IsOptional()
    @IsString()
    dimensions?: string;
  
    @IsIn(printVelocity)
    @IsOptional()
    @IsString()
    printVelocity?: string;
  
    @IsOptional()
    @IsString()
    maxPrintSizeSimple?: string;
  
    @IsOptional()
    @IsString()
    maxPrintSize?: string;

    @IsIn(paperSizes)
    @IsOptional()
    @IsString()
    printSize?: string;
  
    @IsOptional()
    @IsString()
    maxPaperWeight?: string;
  
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    duplexUnit?: boolean;
  
    @IsOptional()
    @IsString()
    paperSizes?: string;
  
    @IsOptional()
    @IsString()
    applicableOS?: string;
  
    @IsOptional()
    @IsString()
    printerFunctions?: string;
  
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    barcode?: string[];
  }
  