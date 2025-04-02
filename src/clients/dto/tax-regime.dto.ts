// src/dtos/tax-regime.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TaxRegime {
  @IsNotEmpty()
  @IsNumber()
  code: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}