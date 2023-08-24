import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto, LoginDto, CreateUserDto, UpdateAuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
  @InjectModel(User.name) 
  private userModel: Model<User>,
  private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {

    try {
      
      const { password, ...userData } = createUserDto

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      await newUser.save();
      const {password:_, ...user} = newUser.toJSON();


      return user;

    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('something went wrong');
    }

   
  }

  //registers user
 async register(registerDto: RegisterUserDto): Promise<LoginResponse>{

  const user = await this.create(registerDto);
  console.log({user});

  return{
    user: user,
    token: this.getJwtToken({id: user._id}),

  }
 } 
  
 async login(loginDto: LoginDto):Promise<LoginResponse>{
    
    const {email, password} = loginDto;

    const user = await this.userModel.findOne({email});

    if(!user){
      throw new UnauthorizedException(`Invalid credentials - email`);
    }

    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException(`Invalid credentials - password`);
    }


    const{ password:_, ...rest} = user.toJSON();

    return {
      user:rest,
      token: this.getJwtToken({id: user.id}),
      
    }

  }

  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const { password, ...rest} = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: string, updateAuthDto: UpdateAuthDto): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    // Update user properties
    if (updateAuthDto.email) {
      user.email = updateAuthDto.email;
    }

    if (updateAuthDto.password) {
      user.password = await bcryptjs.hash(updateAuthDto.password, 10);
    }

    if (updateAuthDto.name) {
      user.name = updateAuthDto.name;
    }

    if (updateAuthDto.roles) {
      user.roles = updateAuthDto.roles;
    }

    if (updateAuthDto.isActive !== undefined) {
      user.isActive = updateAuthDto.isActive;
    }
    // Save updated user
    try {
      console.log(user);
      await user.save();
      const { password: _, ...rest } = user.toJSON();
      return rest;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  
  
  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new BadRequestException(`User with id ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  getJwtToken(payload: JwtPayload ){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
