import {
  IsBoolean,
  IsEmail,
  IsString,
  IsStrongPassword,
  isBoolean,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsBoolean()
  isActive = true;

  @IsString({ each: true })
  roles: string[] = ['user'];
}
