import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto, LoginDto, CreateUserDto, UpdateAuthDto } from './dto';
import { classToPlain } from 'class-transformer';
import { UserResponse } from './entities/user-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      await this.userRepository.save(newUser);
      const { password: _, ...user } = newUser;

      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(`${createUserDto.email} already exists`);
      }
      throw new InternalServerErrorException('something went wrong');
    }
  }

  //registers user
  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto);
    console.log({ user });

    return {
      user: user as UserResponse,
      token: this.getJwtToken({ id: user.id.toString() }),
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(`Invalid credentials - email`);
    }

    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException(`Invalid credentials - password`);
    }

    const { password: _, ...rest } = user;

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    const { password, ...rest } = user;
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(
    id: string,
    updateAuthDto: UpdateAuthDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    // Update user properties
    if (updateAuthDto.email) {
      user.email = updateAuthDto.email;
    }

    if (updateAuthDto.oldPassword && updateAuthDto.newPassword) {
      const isOldPasswordValid = await bcryptjs.compare(
        updateAuthDto.oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        throw new BadRequestException('Old password is incorrect');
      }

      user.password = await bcryptjs.hash(updateAuthDto.newPassword, 10);
    } else if (updateAuthDto.password) {
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
      await this.userRepository.save(user);
      const { password: _, ...rest } = user;
      return rest as UserResponse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new BadRequestException(`User with id ${id} not found`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
