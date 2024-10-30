import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private connection: Connection, // Inject TypeORM Connection for transactions
  ) {}

  /**
   * Creates a new Role along with its associated Permission.
   * @param createRoleDto Data transfer object containing role and permission details.
   * @returns The created Role with its Permission.
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, permission } = createRoleDto;

    // Automatically set permission.name based on role name
    const permissionWithName = {
      ...permission,
      name: `${name}_Permissions`,
    };

    // Create a new Permission instance
    const newPermission = this.permissionsRepository.create(permissionWithName);

    // Create the Role and associate it with the newly created Permission
    const role = this.rolesRepository.create({
      name,
      permission: newPermission,
    });

    try {
      const savedRole = await this.rolesRepository.save(role);
      return savedRole;
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException('Role name already exists.');
      }
      throw error;
    }
  }

  /**
   * Retrieves all roles with their associated permissions.
   * @returns An array of Roles.
   */
  findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permission'], // Ensure permission is loaded
    });
  }

  /**
   * Retrieves a single role by ID with its associated permission.
   * @param id The ID of the role to retrieve.
   * @returns The Role entity.
   */
  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permission'], // Ensure permission is loaded
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }
    return role;
  }

  /**
   * Updates a role and its associated permission.
   * @param id The ID of the role to update.
   * @param updateRoleDto Data transfer object containing updated role and permission details.
   * @returns The updated Role entity.
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }

    if (updateRoleDto.permission) {
      // Update permission fields
      Object.assign(role.permission, updateRoleDto.permission);
    }

    try {
      await this.rolesRepository.save(role);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Role name already exists.');
      }
      throw error;
    }

    return this.findOne(id);
  }

  /**
   * Removes a role by its ID.
   * This method ensures that the role is detached from all users before deletion.
   * The entire operation is performed within a transaction for atomicity.
   * @param id The ID of the role to remove.
   */
  async remove(id: string): Promise<void> {
    await this.connection.transaction(async (manager) => {
      // Step 1: Remove entries from the legacy ManyToMany relation table
      await manager
        .createQueryBuilder()
        .delete()
        .from('user_roles_role') // Ensure this table name is correct
        .where('"roleId" = :id', { id })
        .execute();

      // Step 2: Find the role with its current relations
      const role = await manager.findOne(Role, {
        where: { id },
        relations: ['permission', 'users'],
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found.`);
      }

      // Step 3: Detach the role from all associated users (ManyToOne relation)
      await manager
        .createQueryBuilder()
        .relation(User, 'role')
        .of(role.users)
        .set(null);

      // Step 4: Delete the role (Permission will be deleted automatically due to cascading)
      await manager.delete(Role, id);
    });
  }
}
