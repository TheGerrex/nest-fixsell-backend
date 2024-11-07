// src/auth/auth.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateAuthDto, LoginDto, RegisterUserDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Creates a new user.
   * @param createUserDto Data transfer object containing user details.
   * @returns The created user without the password.
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  /**
   * Logs in a user and returns user information along with a JWT token.
   * @param loginDto Data transfer object containing login credentials.
   * @returns LoginResponse containing user data and JWT token.
   */
  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  /**
   * Registers a new user and returns user information along with a JWT token.
   * @param registerDto Data transfer object containing registration details.
   * @returns LoginResponse containing user data and JWT token.
   */
  @Post('/register')
  register(@Body() registerDto: RegisterUserDto): Promise<LoginResponse> {
    return this.authService.register(registerDto);
  }

  /**
   * Retrieves all users. Protected route.
   * @returns An array of UserResponse entities.
   */
  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  /**
   * Checks the validity of the JWT token and returns the user information along with a new token.
   * Protected route.
   * @param req The incoming request containing the user information.
   * @returns An object containing user data and a new JWT token.
   */
  @UseGuards(AuthGuard)
  @Get('check-token')
  async checkToken(@Request() req): Promise<LoginResponse> {
    const user = req.user as User;
    return this.authService.generateToken(user);
  }

  /**
   * Finds a single user by ID. Protected route.
   * @param id The ID of the user to retrieve.
   * @returns The user without the password.
   */
  @UseGuards(AuthGuard)
  @Get('/finduser/:id')
  findOne(@Param('id') id: string) {
    return this.authService.findUserById(id);
  }

  /**
   * Updates a user's information. Public route.
   * @param id The ID of the user to update.
   * @param updateAuthDto Data transfer object containing updated user details.
   * @returns The updated user without the password.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  /**
   * Removes a user by ID. Protected route.
   * @param id The ID of the user to remove.
   */
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
