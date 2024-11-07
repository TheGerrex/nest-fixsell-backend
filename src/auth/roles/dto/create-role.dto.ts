import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePermissionDto } from 'src/auth/permissions/dto/create-permission.dto';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => CreatePermissionDto)
  permission: CreatePermissionDto;
}
