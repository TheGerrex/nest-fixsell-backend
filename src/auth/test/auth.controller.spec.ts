import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import {
  CreateUserDto,
  UpdateAuthDto,
  LoginDto,
  RegisterUserDto,
} from '../dto';
import { UserResponse } from '../entities/user-response.interface';
import { LoginResponse } from '../interfaces/login-response';
import { Permission } from '../permissions/entities/permission.entity';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '../guards/auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  // Create a complete mock permission with all required fields
  const mockPermission: Permission = {
    id: '1',
    name: 'all',
    canCreatePrinter: true,
    canDeletePrinter: true,
    canUpdatePrinter: true,
    canViewPrinter: true,
    canManagePrinterCRUD: true,
    canCreateCategory: true,
    canDeleteCategory: true,
    canUpdateCategory: true,
    canViewCategory: true,
    canCreateBrand: true,
    canDeleteBrand: true,
    canUpdateBrand: true,
    canViewBrand: true,
    canCreateConsumable: true,
    canDeleteConsumable: true,
    canUpdateConsumable: true,
    canViewConsumable: true,
    canCreateDeal: true,
    canDeleteDeal: true,
    canUpdateDeal: true,
    canViewDeal: true,
    canCreatePackage: true,
    canDeletePackage: true,
    canUpdatePackage: true,
    canViewPackage: true,
    canCreateLead: true,
    canDeleteLead: true,
    canUpdateLead: true,
    canViewLead: true,
    canViewAllLeads: true,
    canBeAssignedToLead: true,
    canCreateUser: true,
    canDeleteUser: true,
    canUpdateUser: true,
    canViewUser: true,
    canCreateTicket: true,
    canDeleteTicket: true,
    canUpdateTicket: true,
    canViewTicket: true,
    canManageUserConfig: true,
    canViewAllTickets: true,
    canCreateChat: true,
    canDeleteChat: true,
    canUpdateChat: true,
    canViewChat: true,
    canCreateLeadCommunication: true,
    canDeleteLeadCommunication: true,
    canUpdateLeadCommunication: true,
    canViewLeadCommunication: true,
    canCreateEvent: true,
    canDeleteEvent: true,
    canUpdateEvent: true,
    canViewEvent: true,
    canConfigureWebsite: true,
    canViewLogs: true,
    role: undefined,
    canCreateClient: false,
    canDeleteClient: false,
    canUpdateClient: false,
    canViewClient: false,
    canViewAllClients: false,
    canBeAssignedToClient: false,
    canConfigureSupport: false,
  };

  // Mock user data with required leads property
  const mockUser: UserResponse = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'test@example.com',
    name: 'Test User',
    isActive: true,
    role: {
      users: [],
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'admin',
      permission: mockPermission, // Use the complete mock permission
    },
    leads: [], // Add the required leads property
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            login: jest.fn(),
            register: jest.fn(),
            findAll: jest.fn(),
            findUserById: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            generateToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(true),
          },
        },
        AuthGuard,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: '123e4567-e89b-12d3-a456-426614174000',
      };
      service.create.mockResolvedValue(mockUser);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should login a user and return token', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const expectedResponse: LoginResponse = {
        user: mockUser,
        token: 'jwt_token',
      };
      service.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(service.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      // Arrange
      const registerDto: RegisterUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
        role: '123e4567-e89b-12d3-a456-426614174000',
      };
      const expectedResponse: LoginResponse = {
        user: mockUser,
        token: 'jwt_token',
      };
      service.register.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(registerDto);

      // Assert
      expect(service.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Arrange
      const mockUsers: UserResponse[] = [mockUser];
      service.findAll.mockResolvedValue(mockUsers);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('checkToken', () => {
    it('should return user and new token', async () => {
      // Arrange
      const req = {
        user: {
          ...mockUser,
          password: 'hashed_password',
        },
      };
      const expectedResponse: LoginResponse = {
        user: mockUser,
        token: 'new_jwt_token',
      };
      service.generateToken.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.checkToken(req);

      // Assert
      expect(service.generateToken).toHaveBeenCalledWith(req.user);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      service.findUserById.mockResolvedValue(mockUser);

      // Act
      const result = await controller.findOne(userId);

      // Assert
      expect(service.findUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      const updateAuthDto: UpdateAuthDto = {
        name: 'Updated Name',
      };
      const updatedUser: UserResponse = {
        ...mockUser,
        name: 'Updated Name',
      };
      service.update.mockResolvedValue(updatedUser);

      // Act
      const result = await controller.update(userId, updateAuthDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(userId, updateAuthDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      // Arrange
      const userId = '123e4567-e89b-12d3-a456-426614174001';
      service.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(userId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });
});
