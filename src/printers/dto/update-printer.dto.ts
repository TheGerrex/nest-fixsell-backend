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

export class UpdatePrinterDto extends PartialType(CreatePrinterDto) {}
