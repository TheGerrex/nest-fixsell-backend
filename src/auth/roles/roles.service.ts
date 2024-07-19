import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const role = this.rolesRepository.create(createRoleDto);

    try {
      await this.rolesRepository.save(role);
    } catch (error) {
      if (error.code === '23505') { // 23505 is the code for unique_violation in PostgreSQL
        throw new ConflictException('El nombre del rol ya existe.');
      } else {
        throw error;
      }
    }

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
    try {
      await this.rolesRepository.update(id, updateRoleDto);
    } catch (error) {
      if (error.code === '23505') { // 23505 is the code for unique_violation in PostgreSQL
        throw new ConflictException('El nombre del rol ya existe.');
      } else {
        throw error;
      }
    }
    return this.rolesRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async remove(id: string) {
    // Find users with this role
    const users = await this.usersRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.roles', 'role', 'role.id = :id', { id })
      .getMany();
  
    // Remove the role from their roles array
    for (const user of users) {
      const roleToRemove = user.roles.find(role => role.id === id);
      if (roleToRemove) {
        await this.usersRepository.createQueryBuilder()
          .relation(User, 'roles')
          .of(user)
          .remove(roleToRemove);
      }
    }
  
    // Delete the role
    return this.rolesRepository.delete(id);
  }
}
