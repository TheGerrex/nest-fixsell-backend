import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
