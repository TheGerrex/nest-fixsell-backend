import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(permission);
  }

  findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
    });
    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found.`);
    }
    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    // Update only the provided fields
    Object.assign(permission, updatePermissionDto);

    try {
      return await this.permissionsRepository.save(permission);
    } catch (error) {
      throw new BadRequestException('Failed to update permission.');
    }
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionsRepository.remove(permission);
  }
}
