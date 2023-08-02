import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        
    ) {}

    async signUp(signUpDtp: SignUpDto ): Promise<{token: string}> {
        const {name, email, password, role} = signUpDtp;

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        })

        const token = this.jwtService.sign({id: user._id, role: user.role});

        return {token};
    }

    async login(loginDto: LoginDto): Promise<{token: string}> {
        const { email, password} = loginDto;

        const user = await this.userModel.findOne({email});

        if(!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({id: user._id, role: user.role});

        return {token};
    }
}
