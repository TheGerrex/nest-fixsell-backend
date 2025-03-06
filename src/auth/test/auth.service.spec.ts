import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compareSync: jest.fn(),
  hashSync: jest.fn().mockReturnValue('hashed_password'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<Repository<User>>;
  let roleRepository: jest.Mocked<Repository<Role>>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  // Mock data
  const mockRole = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'admin',
    permission: { id: '1', name: 'all' },
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashed_password',
    isActive: true,
    role: mockRole,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock_token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test_secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
    roleRepository = module.get(getRepositoryToken(Role));
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: '123e4567-e89b-12d3-a456-426614174000',
        isActive: true,
      };

      roleRepository.findOne.mockResolvedValue(mockRole as any);
      userRepository.create.mockReturnValue(mockUser as any);
      userRepository.save.mockResolvedValue(undefined);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: { id: createUserDto.role },
      });
      expect(bcryptjs.hashSync).toHaveBeenCalledWith('password123', 10);
      expect(userRepository.create).toHaveBeenCalledWith({
        password: 'hashed_password',
        role: mockRole,
        isActive: true,
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        isActive: mockUser.isActive,
        role: mockUser.role,
      });
    });

    it('should throw BadRequestException if role ID is not provided', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: '',
        isActive: true,
      };

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if role ID format is invalid', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: 'invalid-uuid',
        isActive: true,
      };

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if role does not exist', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: '123e4567-e89b-12d3-a456-426614174000',
        isActive: true,
      };

      roleRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: '123e4567-e89b-12d3-a456-426614174000',
        isActive: true,
      };

      roleRepository.findOne.mockResolvedValue(mockRole as any);
      userRepository.create.mockReturnValue(mockUser as any);
      userRepository.save.mockRejectedValue({ code: '23505' });

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      (bcryptjs.compareSync as jest.Mock).mockReturnValue(true);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
        relations: ['role', 'role.permission'],
      });
      expect(bcryptjs.compareSync).toHaveBeenCalledWith(
        'password123',
        'hashed_password',
      );
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          isActive: mockUser.isActive,
          role: mockUser.role,
        },
        token: 'mock_token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      // Arrange
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      userRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      // Arrange
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      userRepository.findOne.mockResolvedValue(mockUser as any);
      (bcryptjs.compareSync as jest.Mock).mockReturnValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
