import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateClientSuspensionConfigDto {
  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsBoolean()
  @IsOptional()
  validateByDueDate?: boolean;

  @IsBoolean()
  @IsOptional()
  suspendForServiceAndParts?: boolean;

  @IsBoolean()
  @IsOptional()
  suspendForSalesDocuments?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  graceDays?: number;
}
