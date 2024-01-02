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

  @IsString({ each: true })
  img_url: string[];

  @IsString()
  description: string;

  @IsDecimal()
  price: number;

  @IsIn(categories)
  @IsString()
  category: string;

  @IsBoolean()
  color: boolean;

  @IsBoolean()
  rentable: boolean;

  @IsString()
  powerConsumption: string;

  @IsString()
  dimensions: string;

  @IsString()
  printVelocity: string;

  @IsOptional()
  @IsString()
  maxPrintSizeSimple?: string;

  @IsString()
  maxPrintSize: string;

  @IsString()
  printSize: string;

  @IsString()
  maxPaperWeight: string;

  @IsBoolean()
  duplexUnit: boolean;

  @IsString()
  paperSizes: string;

  @IsString()
  applicableOS: string;

  @IsString()
  printerFunctions: string;

  @IsString({ each: true })
  barcode: string[];
}
