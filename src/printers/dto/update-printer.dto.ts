import { PartialType } from '@nestjs/mapped-types';
import { CreatePrinterDto } from './create-printer.dto';
import { IsBoolean, IsIn, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

const brands = ['Konica Minolta', 'Kyocera', 'Epson'];
const categories = [
  'Oficina',
  'Produccion',
  'Inyección de Tinta',
  'Artes Gráficas',
  'Etiquetas',
];

export class UpdatePrinterDto extends PartialType(CreatePrinterDto) {
  @IsIn(brands)
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  description: string;

  @IsIn(categories)
  @IsString()
  category: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  color: boolean;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  rentable: boolean;

  @IsString()
  powerConsumption: string;

  @IsString()
  dimensions: string;

  @IsString()
  printVelocity: string;

  @IsString()
  maxPrintSizeSimple: string;

  @IsString()
  maxPrintSize: string;

  @IsString()
  maxPaperWeight: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  duplexUnit: boolean;

  @IsString()
  paperSizes: string;

  @IsString()
  applicableOS: string;

  @IsUrl()
  datasheetUrl: string;

  @IsString()
  printerFunction: string;

  @IsString()
  img_url: [string];

  @IsString()
  barcode: [string];
}
