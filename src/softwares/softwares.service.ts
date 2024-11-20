import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSoftwareDto } from './dto/create-software.dto';
import { UpdateSoftwareDto } from './dto/update-software.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Software } from './entities/software.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class SoftwaresService {
  constructor(
    @InjectRepository(Software)
    private softwaresRepository: Repository<Software>,
  ) { }

  async create(createSoftwareDto: CreateSoftwareDto): Promise<Software> {
    try {
      const software = this.softwaresRepository.create(createSoftwareDto);
      return await this.softwaresRepository.save(software);
    } catch (error) {
      console.error('Error al crear software:', error);
      throw new InternalServerErrorException('Fallo al crear software');
    }
  }

  async findAll(): Promise<Software[]> {
    try {
      const softwares = await this.softwaresRepository.find();
      if (!softwares.length) {
        throw new NotFoundException('No se encontro software');
      }
      return softwares;
    } catch (error) {
      console.error('Error al traer software:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Software> {
    if (!isUUID(id)) {
      throw new NotFoundException(`UUID Invalido: ${id}`);
    }

    const software = await this.softwaresRepository.findOne({
      where: { id: id as any },
    });

    if (!software) {
      throw new NotFoundException(`Software no encontrado con id: ${id}`);
    }

    return software;
  }

  async update(id: string, updateSoftwareDto: UpdateSoftwareDto): Promise<Software> {
    try {
      const result = await this.softwaresRepository.update(id, updateSoftwareDto);
      if (result.affected === 0) {
        throw new NotFoundException(`Software no encontrado con id: ${id}`);
      }
      const updatedSoftware = await this.softwaresRepository.findOne({
        where: { id: id as any },
      });
      if (!updatedSoftware) {
        throw new NotFoundException(`Software no encontrado con id: ${id}`);
      }
      return updatedSoftware;
    } catch (error) {
      console.error('Error al actualizar software:', error);
      throw new InternalServerErrorException('Fallo al actualizar el software');
    }
  }

  async remove(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new NotFoundException(`UUID Invalido: ${id}`);
    }

    try {
      const result = await this.softwaresRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Software no encontrado con id: ${id}`);
      }
    } catch (error) {
      console.error('Error eliminando software:', error);
      throw new InternalServerErrorException('Fallo al eliminar software');
    }
  }
}
