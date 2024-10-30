// src/auth/auth.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtPayload } from './interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto, LoginDto, CreateUserDto, UpdateAuthDto } from './dto';
import { UserResponse } from './entities/user-response.interface';
import { ConfigService } from '@nestjs/config';
import { Role } from './roles/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  /**
   * Creates a new user with a single role.
   * @param createUserDto Data transfer object containing user details.
   * @returns The created user without the password.
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const { password, role, isActive, ...userData } = createUserDto;

      // Assign default values if not provided
      const userIsActive = isActive !== undefined ? isActive : true;
      const userRoleName = role || 'user';

      // Fetch the role from the database by name
      const roleEntity = await this.roleRepository.findOne({
        where: { name: userRoleName },
      });

      if (!roleEntity) {
        throw new BadRequestException(`Role '${userRoleName}' does not exist.`);
      }

      // Create the new user with the hashed password and assigned role
      const newUser = this.userRepository.create({
        password: bcryptjs.hashSync(password, 10),
        role: roleEntity,
        isActive: userIsActive,
        ...userData,
      });

      await this.userRepository.save(newUser);

      // Exclude the password from the returned user object
      const { password: _, ...user } = newUser;

      return user as UserResponse;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `User with email '${createUserDto.email}' already exists.`,
        );
      }
      throw new InternalServerErrorException(
        'An unexpected error occurred. Please try again.',
      );
    }
  }

  /**
   * Registers a new user and returns the user information along with a JWT token.
   * @param registerDto Data transfer object containing registration details.
   * @returns LoginResponse containing user data and JWT token.
   */
  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto as CreateUserDto);

    return {
      user: user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  /**
   * Logs in a user by validating credentials and returning a JWT token.
   * @param loginDto Data transfer object containing login credentials.
   * @returns LoginResponse containing user data and JWT token.
   */
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    // Find the user by email
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role', 'role.permission'], // Ensure role and permission are loaded
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials - email');
    }

    // Validate the password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials - password');
    }

    // Exclude the password from the returned user object
    const { password: _, ...rest } = user;

    return {
      user: rest as UserResponse,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  /**
   * Retrieves all users.
   * @returns An array of UserResponse entities.
   */
  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      relations: ['role', 'role.permission'],
    });
    return users.map(({ password, ...rest }) => rest as UserResponse);
  }

  /**
   * Finds a user by their ID.
   * @param id The ID of the user.
   * @returns The user without the password.
   */
  async findUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permission'],
    });

    if (!user) {
      throw new BadRequestException(`User with ID '${id}' not found.`);
    }

    const { password, ...rest } = user;
    return rest as UserResponse;
  }

  /**
   * Finds a user by their ID.
   * @param id The ID of the user.
   * @returns The user without the password.
   */
  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permission'],
    });

    if (!user) {
      throw new BadRequestException(`User with ID '${id}' not found.`);
    }

    const { password, ...rest } = user;
    return rest as UserResponse;
  }

  /**
   * Updates a user's information.
   * @param id The ID of the user to update.
   * @param updateAuthDto Data transfer object containing updated user details.
   * @returns The updated user without the password.
   */
  async update(
    id: string,
    updateAuthDto: UpdateAuthDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permission'],
    });

    if (!user) {
      throw new BadRequestException(`User with ID '${id}' not found.`);
    }

    // Update email if provided
    if (updateAuthDto.email) {
      user.email = updateAuthDto.email;
    }

    // Update name if provided
    if (updateAuthDto.name) {
      user.name = updateAuthDto.name;
    }

    // Update isActive status if provided
    if (updateAuthDto.isActive !== undefined) {
      user.isActive = updateAuthDto.isActive;
    }

    // Update role if provided
    if (updateAuthDto.role) {
      const roleEntity = await this.roleRepository.findOne({
        where: { name: updateAuthDto.role },
      });

      if (!roleEntity) {
        throw new BadRequestException(
          `Role '${updateAuthDto.role}' does not exist.`,
        );
      }

      user.role = roleEntity;
    }

    // Update password if provided
    if (updateAuthDto.oldPassword && updateAuthDto.newPassword) {
      const isOldPasswordValid = await bcryptjs.compare(
        updateAuthDto.oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        throw new BadRequestException('Old password is invalid.');
      }

      user.password = await bcryptjs.hash(updateAuthDto.newPassword, 10);
    } else if (updateAuthDto.password) {
      user.password = await bcryptjs.hash(updateAuthDto.password, 10);
    }

    // Save the updated user
    try {
      await this.userRepository.save(user);
      const { password, ...rest } = user;
      return rest as UserResponse;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          `User with email '${updateAuthDto.email}' already exists.`,
        );
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Removes a user by their ID.
   * @param id The ID of the user to remove.
   */
  async remove(id: string): Promise<void> {
    try {
      const result = await this.userRepository.delete(id);
      if (result.affected === 0) {
        throw new BadRequestException(`User with ID '${id}' not found.`);
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Generates a JWT token for a given payload.
   * @param payload The payload to include in the JWT.
   * @returns The signed JWT token.
   */
  getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SEED'),
      expiresIn: '1h', // Adjust expiration as needed
    });
  }
}
