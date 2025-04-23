import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class Cfdi {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  appliesTo: string[];
}