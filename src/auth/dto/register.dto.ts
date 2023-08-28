import { IsBoolean, IsEmail, IsString, IsStrongPassword, } from "class-validator";



export class RegisterUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsStrongPassword({minLength:8, minLowercase:1, minUppercase:1, minNumbers:1, minSymbols:1})
    password :string;

    @IsBoolean()
    isActive: boolean = true;

    @IsString({each:true})
    roles: string[] = ['user'];

}
