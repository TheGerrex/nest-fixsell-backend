// src/auth/auth.service.ts

import {
  Injectable,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto, LoginDto, CreateUserDto, UpdateAuthDto } from './dto';
import { LoginResponse } from './interfaces/login-response';
import { UserResponse } from './entities/user-response.interface';
import { JwtPayload } from './interfaces/jwt-payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Creates a new user with a single role.
   * @param createUserDto Data transfer object containing user details.
   * @returns The created user without the password.
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const { password, role, isActive = true, ...userData } = createUserDto;

    // Validate that role is provided
    if (!role) {
      throw new BadRequestException({
        message: 'Role ID is required.',
        code: 'ROLE_ID_REQUIRED',
      });
    }

    // Validate role ID format (basic check for UUID structure)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(role)) {
      throw new BadRequestException({
        message: 'Invalid role ID format.',
        code: 'INVALID_ROLE_ID_FORMAT',
      });
    }

    // Fetch the role from the database by ID
    const roleEntity = await this.roleRepository.findOne({
      where: { id: role },
    });

    if (!roleEntity) {
      throw new BadRequestException({
        message: `Role with ID '${role}' does not exist.`,
        code: 'ROLE_NOT_FOUND',
      });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create the new user with the hashed password and assigned role
    const newUser = this.userRepository.create({
      password: hashedPassword,
      role: roleEntity,
      isActive,
      ...userData,
    });

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate email error
        throw new ConflictException({
          message: `User with email '${createUserDto.email}' already exists.`,
          code: 'EMAIL_EXISTS',
        });
      }
      // For all other errors, throw a generic internal server error
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred. Please try again.',
        code: 'UNEXPECTED_ERROR',
      });
    }

    // Exclude the password from the returned user object
    const { password: _, ...user } = newUser;
    return user as UserResponse;
  }

  /**
   * Registers a new user and returns the user information along with a JWT token.
   * @param registerDto Data transfer object containing registration details.
   * @returns LoginResponse containing user data and JWT token.
   */
  async register(registerDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerDto as CreateUserDto);

    return {
      user,
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
      throw new UnauthorizedException({
        message: 'Invalid credentials.',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Validate the password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException({
        message: 'Invalid credentials.',
        code: 'INVALID_CREDENTIALS',
      });
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
    if (!this.isValidUUID(id)) {
      throw new BadRequestException({
        message: 'Invalid user ID format.',
        code: 'INVALID_USER_ID_FORMAT',
      });
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permission'],
    });

    if (!user) {
      throw new BadRequestException({
        message: `User with ID '${id}' not found.`,
        code: 'USER_NOT_FOUND',
      });
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
    if (!this.isValidUUID(id)) {
      throw new BadRequestException({
        message: 'Invalid user ID format.',
        code: 'INVALID_USER_ID_FORMAT',
      });
    }

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'role.permission'],
    });

    if (!user) {
      throw new BadRequestException({
        message: `User with ID '${id}' not found.`,
        code: 'USER_NOT_FOUND',
      });
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
      // Validate role ID format
      if (!this.isValidUUID(updateAuthDto.role)) {
        throw new BadRequestException({
          message: 'Invalid role ID format.',
          code: 'INVALID_ROLE_ID_FORMAT',
        });
      }

      const roleEntity = await this.roleRepository.findOne({
        where: { id: updateAuthDto.role },
      });

      if (!roleEntity) {
        throw new BadRequestException({
          message: `Role with ID '${updateAuthDto.role}' does not exist.`,
          code: 'ROLE_NOT_FOUND',
        });
      }

      user.role = roleEntity;
    }

    // Update password if provided
    if (updateAuthDto.oldPassword && updateAuthDto.newPassword) {
      const isOldPasswordValid = bcryptjs.compareSync(
        updateAuthDto.oldPassword,
        user.password,
      );

      if (!isOldPasswordValid) {
        throw new BadRequestException({
          message: 'Old password is invalid.',
          code: 'INVALID_OLD_PASSWORD',
        });
      }

      user.password = bcryptjs.hashSync(updateAuthDto.newPassword, 10);
    } else if (updateAuthDto.password) {
      user.password = bcryptjs.hashSync(updateAuthDto.password, 10);
    }

    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // Duplicate email error
        throw new ConflictException({
          message: `User with email '${updateAuthDto.email}' already exists.`,
          code: 'EMAIL_EXISTS',
        });
      }
      // For all other errors, throw a generic internal server error
      throw new InternalServerErrorException({
        message: 'An unexpected error occurred. Please try again.',
        code: 'UNEXPECTED_ERROR',
      });
    }

    // Exclude the password from the returned user object
    const { password: _, ...updatedUser } = user;
    return updatedUser as UserResponse;
  }

  /**
   * Removes a user by their ID.
   * @param id The ID of the user to remove.
   */
  async remove(id: string): Promise<void> {
    if (!this.isValidUUID(id)) {
      throw new BadRequestException({
        message: 'Invalid user ID format.',
        code: 'INVALID_USER_ID_FORMAT',
      });
    }

    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException({
        message: `User with ID '${id}' not found.`,
        code: 'USER_NOT_FOUND',
      });
    }
  }

  /**
   * Generates a JWT token for a given user.
   * @param user The user for whom to generate the token.
   * @returns LoginResponse containing user data and JWT token.
   */
  async generateToken(user: User): Promise<LoginResponse> {
    const { password, ...userData } = user;
    return {
      user: userData as UserResponse,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // Make getJwtToken public if needed
  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SEED'),
      expiresIn: '1h',
    });
  }

  /**
   * Validates if a string is a valid UUID.
   * @param id The string to validate.
   * @returns Boolean indicating if the string is a valid UUID.
   */
  private isValidUUID(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }
}
