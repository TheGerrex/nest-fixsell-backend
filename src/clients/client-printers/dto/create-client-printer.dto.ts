import { IsOptional, IsUUID, IsEnum, IsString, IsInt } from 'class-validator';
import { ClientPrinterPurchaseStatus } from '../entities/client-printer.entity';

export class CreateClientPrinterDto {
  @IsUUID()
  clientId: string;

  @IsUUID()
  printerId: string;

  @IsString()
  @IsOptional()
  macAddress?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsOptional()
  @IsEnum(ClientPrinterPurchaseStatus)
  purchaseStatus?: ClientPrinterPurchaseStatus;

  // Additional optional fields for SMTP and device info
  @IsString()
  @IsOptional()
  smtpServer?: string;

  @IsInt()
  @IsOptional()
  smtpPort?: number;

  @IsString()
  @IsOptional()
  smtpSecurity?: string;

  @IsString()
  @IsOptional()
  smtpEmail?: string;

  @IsString()
  @IsOptional()
  smtpPassword?: string;

  @IsString()
  @IsOptional()
  devicePassword?: string;

  @IsString()
  @IsOptional()
  billingDay?: string;

  @IsString()
  @IsOptional()
  ip?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
