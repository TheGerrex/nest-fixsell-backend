import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @IsOptional()
  @IsString()
  name?: string;
}
