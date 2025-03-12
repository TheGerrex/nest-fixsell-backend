import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { BaseClassification } from '../entities/base-classification.entity';
import { BaseClassificationDto } from '../dto/base-classification.dto';
import { isUUID } from 'class-validator';

@Injectable()
export abstract class BaseClassificationService<T extends BaseClassification> {
  constructor(protected repository: Repository<T>) {}

  async create(dto: BaseClassificationDto): Promise<T> {
    try {
      const entity = this.repository.create(dto as any);
      // Fix: Repository.save() returns T, not T[]
      return await this.repository.save(entity as unknown as T);
    } catch (error) {
      console.error('Error creating classification:', error);
      if (error.code === '23505') {
        // Duplicate key violation
        throw new ConflictException(
          `A classification with name "${dto.name}" already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to create classification');
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find({ where: { isActive: true } as any });
    } catch (error) {
      console.error('Error finding classifications:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve classifications',
      );
    }
  }

  async findOne(id: string): Promise<T> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const classification = await this.repository.findOne({
        where: { id, isActive: true } as any,
      });

      if (!classification) {
        throw new NotFoundException(`Classification with ID ${id} not found`);
      }

      return classification;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      console.error('Error finding classification:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve classification',
      );
    }
  }

  async update(id: string, dto: BaseClassificationDto): Promise<T> {
    await this.findOne(id);

    try {
      await this.repository.update(id, dto as any);
      return await this.findOne(id);
    } catch (error) {
      console.error('Error updating classification:', error);
      if (error.code === '23505') {
        // Duplicate key violation
        throw new ConflictException(
          `A classification with name "${dto.name}" already exists`,
        );
      }
      throw new InternalServerErrorException('Failed to update classification');
    }
  }

  async remove(id: string): Promise<T> {
    const classification = await this.findOne(id);

    try {
      await this.repository.update(id, { isActive: false } as any);
      return classification;
    } catch (error) {
      console.error('Error removing classification:', error);
      throw new InternalServerErrorException('Failed to remove classification');
    }
  }
}
