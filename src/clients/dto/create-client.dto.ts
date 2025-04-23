import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { TaxRegimeInterface } from '../interfaces/tax_regime.interface';
import { Type } from 'class-transformer';
import { TaxRegime } from './tax-regime.dto';
import { Cfdi } from './cfdi.dto';
import { CfdiInterface } from '../interfaces/cfdi.interface';

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
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => Cfdi)
  cfdiUse: CfdiInterface;

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
