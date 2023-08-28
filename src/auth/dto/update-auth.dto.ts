import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsBoolean,
} from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateUserDto) {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  // @IsStrongPassword({minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})
  // password :string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  oldPassword: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  newPassword!: string;

  @IsBoolean()
  isActive: boolean = true;

  @IsString({ each: true })
  roles: string[] = ['user'];
}
