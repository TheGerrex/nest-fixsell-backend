import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { CfdiAllowedValues } from '../interfaces/cfdi.interface';
import { TaxRegimeInterface } from '../interfaces/tax_regime.interface';
import { Type } from 'class-transformer';
import { TaxRegime } from './tax-regime.dto';

const allowedCfdiValues: CfdiAllowedValues[] = [
  'Adquisición de mercancias',
  'Aportaciones voluntarios al SAR',
  'Comunicaciones satelitales',
  'Comunicaciones telefónicas',
  'Construcciones',
  'Dados, troqueles, moldes, matrices y herramental',
  'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones',
  'Devoluciones, descuentos o bonificaciones',
  'Donativos',
  'Equipo de computo y accesorios',
  'Equipo de transporte',
  'Gastos de transportación escolar obligatoria',
  'Gastos en general',
  'Gastos funerales',
  'Gastos médicos por incapacidad o discapacidad',
  'Honorarios médicos, dentales y gastos hospitalarios',
  'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)',
  'Mobiliario y equipo de oficina por inversiones',
  'Otra maquinaria y equipo',
  'Pagos',
  'Pagos por servicios educativos (colegiaturas)',
  'Por definir',
  'Primas por seguros de gastos médicos',
  'Sin efectos fiscales',
];

const allowedTaxRegimes: TaxRegimeInterface[] = [
  { code: 601, description: 'RÉGIMEN GENERAL DE LEY PERSONAS MORALES' },
  { code: 602, description: 'RÉGIMEN SIMPLIFICADO DE LEY PERSONAS MORALES' },
  { code: 603, description: 'PERSONAS MORALES CON FINES NO LUCRATIVOS' },
  { code: 604, description: 'RÉGIMEN DE PEQUEÑOS CONTRIBUYENTES' },
  { code: 605, description: 'RÉGIMEN DE SUELDOS Y SALARIOS E INGRESOS ASIMILADOS A SALARIOS' },
  { code: 606, description: 'RÉGIMEN DE ARRENDAMIENTO' },
  { code: 607, description: 'RÉGIMEN DE ENAJENACIÓN O ADQUISICIÓN DE BIENES' },
  { code: 608, description: 'RÉGIMEN DE LOS DEMÁS INGRESOS' },
  { code: 609, description: 'RÉGIMEN DE CONSOLIDACIÓN' },
  { code: 610, description: 'RÉGIMEN RESIDENTES EN EL EXTRANJERO SIN ESTABLECIMIENTO PERMANENTE EN MÉXICO' },
  { code: 611, description: 'RÉGIMEN DE INGRESOS POR DIVIDENDOS (SOCIOS Y ACCIONISTAS)' },
  { code: 612, description: 'RÉGIMEN DE LAS PERSONAS FÍSICAS CON ACTIVIDADES EMPRESARIALES Y PROFESIONALES' },
  { code: 613, description: 'RÉGIMEN INTERMEDIO DE LAS PERSONAS FÍSICAS CON ACTIVIDADES EMPRESARIALES' },
  { code: 614, description: 'RÉGIMEN DE LOS INGRESOS POR INTERESES' },
  { code: 615, description: 'RÉGIMEN DE LOS INGRESOS POR OBTENCIÓN DE PREMIOS' },
  { code: 616, description: 'SIN OBLIGACIONES FISCALES' },
  { code: 617, description: 'PEMEX' },
  { code: 618, description: 'RÉGIMEN SIMPLIFICADO DE LEY PERSONAS FÍSICAS' },
  { code: 619, description: 'INGRESOS POR LA OBTENCIÓN DE PRÉSTAMOS' },
  { code: 620, description: 'SOCIEDADES COOPERATIVAS DE PRODUCCIÓN QUE OPTAN POR DIFERIR SUS INGRESOS' },
  { code: 621, description: 'RÉGIMEN DE INCORPORACIÓN FISCAL' },
  { code: 622, description: 'RÉGIMEN DE ACTIVIDADES AGRÍCOLAS, GANADERAS, SILVÍCOLAS Y PESQUERAS PM' },
  { code: 623, description: 'RÉGIMEN DE OPCIONAL PARA GRUPOS DE SOCIEDADES' },
  { code: 624, description: 'RÉGIMEN DE LOS COORDINADOS' },
  { code: 625, description: 'RÉGIMEN DE LAS ACTIVIDADES EMPRESARIALES CON INGRESOS A TRAVÉS DE PLATAFORMAS TECNOLÓGICAS' },
  { code: 626, description: 'RÉGIMEN SIMPLIFICADO DE CONFIANZA' },
];

export class CreateClientDto {
  // Razon Social
  @IsString()
  @IsNotEmpty()
  businessName: string;

  // Nombre comercial
  @IsString()
  @IsOptional()
  commercialName?: string;

  // RFC
  @IsString()
  @IsNotEmpty()
  rfc: string;

  // calle
  @IsString()
  @IsNotEmpty()
  street: string;

  // numero exterior
  @IsString()
  @IsNotEmpty()
  exteriorNumber: string;

  // numero interior
  @IsString()
  @IsOptional()
  interiorNumber?: string;

  // Colonia
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  // Uso de CFDI
  @IsString()
  @IsNotEmpty()
  @IsIn(allowedCfdiValues)
  cfdiUse: CfdiAllowedValues;

  // retencion ISR
  @IsBoolean()
  @IsOptional()
  isrRetention?: boolean;

  // localidad
  @IsString()
  @IsOptional()
  locality?: string;

  // Municipio
  @IsString()
  @IsNotEmpty()
  municipality: string;

  // estado
  @IsString()
  @IsNotEmpty()
  state: string;

  // Pais
  @IsString()
  @IsNotEmpty()
  country: string;

  // codigo postal
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  // referencia
  @IsString()
  @IsOptional()
  reference?: string;

  // representante legal
  @IsString()
  @IsNotEmpty()
  legalRepresentative: string;

  // regimen Fiscal
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => TaxRegime)
  taxRegime: TaxRegimeInterface;
}
