import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumibleDto } from './create-consumible.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateConsumibleDto extends PartialType(CreateConsumibleDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  printerIds: string[];
}
