import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  // @IsStrongPassword({minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})
  // password :string;
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  oldPassword: string;
  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword!: string;

  @IsOptional()
  @IsBoolean()
  isActive = true;

  @IsOptional()
  @IsString({ each: true })
  roles: string[] = ['user'];
}
