import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../entities/user.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesService', () => {
  let service: RolesService;
  let rolesRepository: jest.Mocked<Repository<Role>>;
  let permissionsRepository: jest.Mocked<Repository<Permission>>;
  let usersRepository: jest.Mocked<Repository<User>>;
  let connection: jest.Mocked<Connection>;

  // Mock data
  const mockPermission = {
    id: '1',
    name: 'admin_Permissions',
    canCreatePrinter: true,
    canDeletePrinter: true,
    canUpdatePrinter: true,
    canViewPrinter: true,
    canManagePrinterCRUD: true,
    // Add more permission properties as needed
  };

  const mockRole = {
    id: '1',
    name: 'admin',
    permission: mockPermission,
    users: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Permission),
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: Connection,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    rolesRepository = module.get(getRepositoryToken(Role));
    permissionsRepository = module.get(getRepositoryToken(Permission));
    usersRepository = module.get(getRepositoryToken(User));
    connection = module.get(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role with permission successfully', async () => {
      // Arrange
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        permission: {
          name: '',
          canCreatePrinter: true,
          canDeletePrinter: true,
          canUpdatePrinter: true,
          canViewPrinter: true,
          canManagePrinterCRUD: true,
          // Add all required permission properties
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
          canConfigureSupport: true,
          canCreateClient: false,
          canDeleteClient: false,
          canUpdateClient: false,
          canViewClient: false,
          canViewAllClients: false,
          canBeAssignedToClient: false,
        },
      };

      rolesRepository.findOne.mockResolvedValue(null); // Role doesn't exist yet
      permissionsRepository.create.mockReturnValue(mockPermission as any);
      rolesRepository.create.mockReturnValue(mockRole as any);
      rolesRepository.save.mockResolvedValue(mockRole as any);

      // Act
      const result = await service.create(createRoleDto);

      // Assert
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { name: createRoleDto.name },
      });
      expect(permissionsRepository.create).toHaveBeenCalledWith({
        ...createRoleDto.permission,
        name: 'admin_Permissions',
      });
      expect(rolesRepository.create).toHaveBeenCalledWith({
        name: createRoleDto.name,
        permission: mockPermission,
      });
      expect(rolesRepository.save).toHaveBeenCalledWith(mockRole);
      expect(result).toEqual(mockRole);
    });

    it('should throw ConflictException if role name already exists on lookup', async () => {
      // Arrange
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        permission: { name: '', canCreatePrinter: true } as any,
      };

      rolesRepository.findOne.mockResolvedValue(mockRole as any); // Role already exists

      // Act & Assert
      await expect(service.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { name: createRoleDto.name },
      });
    });

    it('should throw ConflictException if unique constraint is violated during save', async () => {
      // Arrange
      const createRoleDto: CreateRoleDto = {
        name: 'admin',
        permission: { name: '', canCreatePrinter: true } as any,
      };

      rolesRepository.findOne.mockResolvedValue(null); // Role doesn't exist yet on lookup
      permissionsRepository.create.mockReturnValue(mockPermission as any);
      rolesRepository.create.mockReturnValue(mockRole as any);
      rolesRepository.save.mockRejectedValue({ code: '23505' }); // Unique constraint violation

      // Act & Assert
      await expect(service.create(createRoleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      // Arrange
      const mockRoles = [mockRole];
      rolesRepository.find.mockResolvedValue(mockRoles as any);

      // Act
      const result = await service.findAll();

      // Assert
      expect(rolesRepository.find).toHaveBeenCalledWith({
        relations: ['permission'],
      });
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findOne', () => {
    it('should return a single role by ID', async () => {
      // Arrange
      const roleId = '1';
      rolesRepository.findOne.mockResolvedValue(mockRole as any);

      // Act
      const result = await service.findOne(roleId);

      // Assert
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
        relations: ['permission'],
      });
      expect(result).toEqual(mockRole);
    });

    it('should throw NotFoundException if role not found', async () => {
      // Arrange
      const roleId = 'nonexistent';
      rolesRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(roleId)).rejects.toThrow(NotFoundException);
      expect(rolesRepository.findOne).toHaveBeenCalledWith({
        where: { id: roleId },
        relations: ['permission'],
      });
    });
  });

  describe('update', () => {
    it('should update a role successfully', async () => {
      // Arrange
      const roleId = '1';
      const updateRoleDto: UpdateRoleDto = {
        name: 'updated_admin',
        permission: {
          ...mockPermission,
          canCreatePrinter: false,
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
          canConfigureSupport: true,
          canCreateClient: false,
          canDeleteClient: false,
          canUpdateClient: false,
          canViewClient: false,
          canViewAllClients: false,
          canBeAssignedToClient: false,
        },
      };

      const existingRole = { ...mockRole };
      const updatedRole = {
        ...mockRole,
        name: 'updated_admin',
        permission: {
          ...mockPermission,
          canCreatePrinter: false,
        },
      };

      rolesRepository.findOne
        .mockResolvedValueOnce(existingRole as any) // For initial findOne
        .mockResolvedValueOnce(updatedRole as any); // For final findOne
      rolesRepository.save.mockResolvedValue(updatedRole as any);

      // Act
      const result = await service.update(roleId, updateRoleDto);

      // Assert
      expect(rolesRepository.findOne).toHaveBeenCalledTimes(2);
      expect(rolesRepository.save).toHaveBeenCalledWith({
        ...existingRole,
        name: 'updated_admin',
        permission: {
          ...existingRole.permission,
          canCreatePrinter: false,
        },
      });
      expect(result).toEqual(updatedRole);
    });

    it('should throw NotFoundException if role not found', async () => {
      // Arrange
      const roleId = 'nonexistent';
      const updateRoleDto: UpdateRoleDto = {
        name: 'updated_admin',
      };

      rolesRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update(roleId, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if unique constraint is violated during update', async () => {
      // Arrange
      const roleId = '1';
      const updateRoleDto: UpdateRoleDto = {
        name: 'updated_admin',
      };

      rolesRepository.findOne.mockResolvedValue(mockRole as any);
      rolesRepository.save.mockRejectedValue({ code: '23505' });

      // Act & Assert
      await expect(service.update(roleId, updateRoleDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a role successfully', async () => {
      // Arrange
      const roleId = '1';

      // Mock transaction function that executes the callback
      connection.transaction.mockImplementation(
        (callbackOrIsolationLevel: any) => {
          const manager = {
            createQueryBuilder: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
            relation: jest.fn().mockReturnThis(),
            of: jest.fn().mockReturnThis(),
            set: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue({
              ...mockRole,
              users: [],
            }),
          };

          // Handle both transaction method signatures
          if (typeof callbackOrIsolationLevel === 'function') {
            return Promise.resolve(callbackOrIsolationLevel(manager));
          }
          const callback = callbackOrIsolationLevel;
          return Promise.resolve(callback(manager));
        },
      );

      // Act
      await service.remove(roleId);

      // Assert
      expect(connection.transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if role not found during removal', async () => {
      // Arrange
      const roleId = 'nonexistent';

      // Mock transaction function that executes the callback
      connection.transaction.mockImplementation(
        (callbackOrIsolationLevel: any) => {
          const manager = {
            createQueryBuilder: jest.fn().mockReturnThis(),
            delete: jest.fn().mockReturnThis(),
            from: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            execute: jest.fn().mockResolvedValue(undefined),
            findOne: jest.fn().mockResolvedValue(null),
          };

          // Handle both transaction method signatures
          if (typeof callbackOrIsolationLevel === 'function') {
            return Promise.resolve(callbackOrIsolationLevel(manager));
          }
          const callback = callbackOrIsolationLevel;
          return Promise.resolve(callback(manager));
        },
      );

      // Act & Assert
      await expect(service.remove(roleId)).rejects.toThrow(NotFoundException);
    });
  });
});
