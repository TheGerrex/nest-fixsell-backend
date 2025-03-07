import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { NotFoundException } from '@nestjs/common';

describe('RolesController', () => {
  let controller: RolesController;
  let service: jest.Mocked<RolesService>;

  // Mock data
  const mockPermission = {
    id: '1',
    name: 'admin_Permissions',
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
    canConfigureSupport: true,
    role: undefined,
  };

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    permission: mockPermission as any,
    users: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new role', async () => {
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
        } as any,
      };

      service.create.mockResolvedValue(mockRole);

      // Act
      const result = await controller.create(createRoleDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createRoleDto);
      expect(result).toEqual(mockRole);
    });
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      // Arrange
      const mockRoles = [mockRole];
      service.findAll.mockResolvedValue(mockRoles);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockRoles);
    });
  });

  describe('findOne', () => {
    it('should return a single role by ID', async () => {
      // Arrange
      const roleId = '1';
      service.findOne.mockResolvedValue(mockRole);

      // Act
      const result = await controller.findOne(roleId);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(roleId);
      expect(result).toEqual(mockRole);
    });

    it('should propagate NotFoundException if service throws it', async () => {
      // Arrange
      const roleId = 'nonexistent';
      service.findOne.mockRejectedValue(
        new NotFoundException(`Role with ID ${roleId} not found`),
      );

      // Act & Assert
      await expect(controller.findOne(roleId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(roleId);
    });
  });

  describe('update', () => {
    it('should update a role', async () => {
      // Arrange
      const roleId = '1';
      const updateRoleDto: UpdateRoleDto = {
        name: 'updated_admin',
        permission: {
          canCreatePrinter: false,
        } as any,
      };

      const updatedRole = {
        ...mockRole,
        name: 'updated_admin',
        permission: {
          ...mockPermission,
          canCreatePrinter: false,
        },
      };

      service.update.mockResolvedValue(updatedRole);

      // Act
      const result = await controller.update(roleId, updateRoleDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(roleId, updateRoleDto);
      expect(result).toEqual(updatedRole);
    });

    it('should propagate NotFoundException if service throws it', async () => {
      // Arrange
      const roleId = 'nonexistent';
      const updateRoleDto: UpdateRoleDto = {
        name: 'updated_admin',
      };

      service.update.mockRejectedValue(
        new NotFoundException(`Role with ID ${roleId} not found`),
      );

      // Act & Assert
      await expect(controller.update(roleId, updateRoleDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(roleId, updateRoleDto);
    });
  });

  describe('remove', () => {
    it('should remove a role', async () => {
      // Arrange
      const roleId = '1';
      service.remove.mockResolvedValue(undefined);

      // Act
      const result = await controller.remove(roleId);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(roleId);
      expect(result).toBeUndefined();
    });

    it('should propagate NotFoundException if service throws it', async () => {
      // Arrange
      const roleId = 'nonexistent';
      service.remove.mockRejectedValue(
        new NotFoundException(`Role with ID ${roleId} not found`),
      );

      // Act & Assert
      await expect(controller.remove(roleId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.remove).toHaveBeenCalledWith(roleId);
    });
  });
});
