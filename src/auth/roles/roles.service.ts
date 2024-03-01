import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);
    await this.rolesRepository.save(role);
    return role;
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: string) {
    return this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    await this.rolesRepository.update(id, updateRoleDto);
    return this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  remove(id: string) {
    return this.rolesRepository.delete(id);
  }
}
