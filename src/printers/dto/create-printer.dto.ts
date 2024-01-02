import {
  IsBoolean,
  IsDecimal,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

const brands = ['Konica Minolta', 'Kyocera', 'Epson'];
const categories = [
  'Oficina',
  'Produccion',
  'Inyección de Tinta',
  'Artes Gráficas',
  'Etiquetas',
];

export class CreatePrinterDto {
  @IsIn(brands)
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsUrl()
  datasheet_url?: string;

  @IsOptional()
  @IsString({ each: true })
  img_url: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsDecimal()
  price: number;

  @IsOptional()
  @IsIn(categories)
  @IsString()
  category: string;

  @IsOptional()
  @IsBoolean()
  color: boolean;

  @IsOptional()
  @IsBoolean()
  rentable: boolean;

  @IsOptional()
  @IsString()
  powerConsumption: string;

  @IsOptional()
  @IsString()
  dimensions: string;

  @IsOptional()
  @IsString()
  printVelocity: string;

  @IsOptional()
  @IsString()
  maxPrintSizeSimple?: string;

  @IsOptional()
  @IsString()
  maxPrintSize: string;

  @IsOptional()
  @IsString()
  printSize: string;

  @IsOptional()
  @IsString()
  maxPaperWeight: string;

  @IsOptional()
  @IsBoolean()
  duplexUnit: boolean;

  @IsOptional()
  @IsString()
  paperSizes: string;

  @IsOptional()
  @IsString()
  applicableOS: string;

  @IsOptional()
  @IsString()
  printerFunctions: string;

  @IsOptional()
  @IsString({ each: true })
  barcode: string[];
}
