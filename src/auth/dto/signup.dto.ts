import { IsString,IsNotEmpty, IsEmail, MinLength, IsStrongPassword  } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Invalid email'})
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: 'Password must be at least 6 characters long'})
    @IsStrongPassword({},{message: 'Password must contain special characters, numbers, uppercase and lowercase letters'})
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    readonly role: string;

}