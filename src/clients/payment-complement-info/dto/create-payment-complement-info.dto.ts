import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentComplementInfoDto {
  @IsUUID()
  @IsNotEmpty()
  clientAccountId: string;

  // RFC ordenante - Sender's tax ID
  @IsString()
  @IsNotEmpty()
  senderTaxId: string;

  // Banco ordenante - Sender's bank
  @IsString()
  @IsNotEmpty()
  senderBank: string;

  // cuenta ordenante - Sender's account number
  @IsString()
  @IsNotEmpty()
  senderAccountNumber: string;

  // RFC Destino - Recipient's tax ID
  @IsString()
  @IsNotEmpty()
  recipientTaxId: string;

  // Cuenta beneficiario - Recipient's account number
  @IsString()
  @IsNotEmpty()
  recipientAccountNumber: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
