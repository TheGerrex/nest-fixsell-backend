import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './create-client.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateClientDto extends PartialType(CreateClientDto) {

  // retencion ISR
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
