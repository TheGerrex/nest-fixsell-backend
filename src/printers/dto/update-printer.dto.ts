import { PartialType } from '@nestjs/mapped-types';
import { CreatePrinterDto } from './create-printer.dto';
<<<<<<< HEAD
=======
import { IsBoolean, IsIn, IsString, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

const brands = ['Konica Minolta', 'Kyocera', 'Epson'];
const categories = [
  'Oficina',
  'Produccion',
  'Inyeccion de Tinta',
  'Artes Graficas',
  'Etiquetas',
];
>>>>>>> fdfe96e59b311d30661e2d73f7ba846a8e62600f

export class UpdatePrinterDto extends PartialType(CreatePrinterDto) {}
