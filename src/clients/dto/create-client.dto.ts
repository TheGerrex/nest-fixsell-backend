import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { CfdiAllowedValues } from '../interfaces/cfdi.interface';

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
  @IsNotEmpty()
  locality: string;

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
  @IsString()
  @IsNotEmpty()
  taxRegime: string;
}
