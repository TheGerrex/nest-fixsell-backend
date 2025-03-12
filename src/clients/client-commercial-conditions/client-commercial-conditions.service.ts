import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientCommercialCondition } from './entities/client-commercial-condition.entity';
import { CreateClientCommercialConditionDto } from './dto/create-client-commercial-condition.dto';
import { UpdateClientCommercialConditionDto } from './dto/update-client-commercial-condition.dto';
import { isUUID } from 'class-validator';
import { Client } from '../entities/client.entity';
// src\clients\interfaces\dayofweek.enum.ts
import { DayOfWeek } from '../interfaces/dayofweek.enum';
import { User } from '@/src/auth/entities/user.entity';

@Injectable()
export class ClientCommercialConditionsService {
  constructor(
    @InjectRepository(ClientCommercialCondition)
    private readonly conditionsRepository: Repository<ClientCommercialCondition>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createDto: CreateClientCommercialConditionDto,
  ): Promise<ClientCommercialCondition> {
    try {
      // First check if client exists
      const client = await this.clientRepository.findOne({
        where: { id: createDto.clientId, isActive: true },
      });

      if (!client) {
        throw new NotFoundException(
          `Client with ID ${createDto.clientId} not found`,
        );
      }

      // Check if assigned executive exists if provided
      if (createDto.assignedExecutiveId) {
        const assignedExecutive = await this.userRepository.findOne({
          where: { id: createDto.assignedExecutiveId, isActive: true },
        });

        if (!assignedExecutive) {
          throw new NotFoundException(
            `Assigned executive with ID ${createDto.assignedExecutiveId} not found`,
          );
        }
      }

      // Check if collection executive exists if provided
      if (createDto.collectionExecutiveId) {
        const collectionExecutive = await this.userRepository.findOne({
          where: { id: createDto.collectionExecutiveId, isActive: true },
        });

        if (!collectionExecutive) {
          throw new NotFoundException(
            `Collection executive with ID ${createDto.collectionExecutiveId} not found`,
          );
        }
      }

      // Check if conditions already exist for this client
      const existingConditions = await this.conditionsRepository.findOne({
        where: { clientId: createDto.clientId },
      });

      if (existingConditions) {
        throw new ConflictException(
          `Commercial conditions for client ${createDto.clientId} already exist. Use update instead.`,
        );
      }

      // Set default empty arrays if not provided
      if (!createDto.reviewDays) {
        createDto.reviewDays = [];
      }

      if (!createDto.paymentDays) {
        createDto.paymentDays = [];
      }

      // Create the new conditions
      const conditions = this.conditionsRepository.create(createDto);
      const savedConditions = await this.conditionsRepository.save(conditions);

      // Return with client relationship
      return await this.conditionsRepository
        .createQueryBuilder('conditions')
        .leftJoinAndSelect('conditions.client', 'client')
        .leftJoinAndSelect('conditions.assignedExecutive', 'assignedExecutive')
        .leftJoinAndSelect(
          'conditions.collectionExecutive',
          'collectionExecutive',
        )
        .where('conditions.id = :id', { id: savedConditions.id })
        .getOne();
    } catch (error) {
      console.error('Error creating client commercial conditions:', error);

      if (error.code === '23505') {
        throw new ConflictException(
          'Commercial conditions for this client already exist',
        );
      }

      if (error.code === '23503') {
        // Handle foreign key constraint violations
        if (error.detail?.includes('clientId')) {
          throw new BadRequestException(
            `Client with ID ${createDto.clientId} does not exist`,
          );
        }
        if (error.detail?.includes('assignedExecutiveId')) {
          throw new BadRequestException(
            `User with ID ${createDto.assignedExecutiveId} does not exist`,
          );
        }
        if (error.detail?.includes('collectionExecutiveId')) {
          throw new BadRequestException(
            `User with ID ${createDto.collectionExecutiveId} does not exist`,
          );
        }
      }

      // If it's already a NestJS exception, rethrow it
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error creating client commercial conditions',
      );
    }
  }

  async findAll(): Promise<ClientCommercialCondition[]> {
    try {
      return await this.conditionsRepository
        .createQueryBuilder('conditions')
        .leftJoinAndSelect('conditions.client', 'client')
        .leftJoinAndSelect('conditions.assignedExecutive', 'assignedExecutive')
        .leftJoinAndSelect(
          'conditions.collectionExecutive',
          'collectionExecutive',
        )
        .where('conditions.isActive = :isActive', { isActive: true })
        .getMany();
    } catch (error) {
      console.error('Error retrieving commercial conditions:', error);
      throw new InternalServerErrorException(
        'Error retrieving commercial conditions',
      );
    }
  }

  async findOne(id: string): Promise<ClientCommercialCondition> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const conditions = await this.conditionsRepository
        .createQueryBuilder('conditions')
        .leftJoinAndSelect('conditions.client', 'client')
        .leftJoinAndSelect('conditions.assignedExecutive', 'assignedExecutive')
        .leftJoinAndSelect(
          'conditions.collectionExecutive',
          'collectionExecutive',
        )
        .where('conditions.id = :id', { id })
        .andWhere('conditions.isActive = :isActive', { isActive: true })
        .getOne();

      if (!conditions) {
        throw new NotFoundException(
          `Commercial conditions with ID ${id} not found`,
        );
      }

      return conditions;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving commercial conditions:', error);
      throw new InternalServerErrorException(
        'Error retrieving commercial conditions',
      );
    }
  }

  async findByClientId(clientId: string): Promise<ClientCommercialCondition> {
    if (!isUUID(clientId)) {
      throw new BadRequestException(`Invalid UUID format: ${clientId}`);
    }

    try {
      const conditions = await this.conditionsRepository
        .createQueryBuilder('conditions')
        .leftJoinAndSelect('conditions.client', 'client')
        .leftJoinAndSelect('conditions.assignedExecutive', 'assignedExecutive')
        .leftJoinAndSelect(
          'conditions.collectionExecutive',
          'collectionExecutive',
        )
        .where('conditions.clientId = :clientId', { clientId })
        .andWhere('conditions.isActive = :isActive', { isActive: true })
        .getOne();

      if (!conditions) {
        throw new NotFoundException(
          `Commercial conditions for client ${clientId} not found`,
        );
      }

      return conditions;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving commercial conditions:', error);
      throw new InternalServerErrorException(
        'Error retrieving commercial conditions',
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdateClientCommercialConditionDto,
  ): Promise<ClientCommercialCondition> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      // First check if the conditions exist
      await this.findOne(id);

      // Update the conditions
      await this.conditionsRepository.update({ id }, updateDto);

      return await this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error.code === '23503') {
        // Handle foreign key constraint violations
        if (error.detail?.includes('assignedExecutiveId')) {
          throw new BadRequestException(
            `User with ID ${updateDto.assignedExecutiveId} does not exist`,
          );
        }
        if (error.detail?.includes('collectionExecutiveId')) {
          throw new BadRequestException(
            `User with ID ${updateDto.collectionExecutiveId} does not exist`,
          );
        }
      }

      throw new InternalServerErrorException(
        'Error updating commercial conditions',
      );
    }
  }

  async updateByClientId(
    clientId: string,
    updateDto: UpdateClientCommercialConditionDto,
  ): Promise<ClientCommercialCondition> {
    if (!isUUID(clientId)) {
      throw new BadRequestException(`Invalid UUID format: ${clientId}`);
    }

    try {
      // First check if the conditions exist
      const conditions = await this.findByClientId(clientId);

      // Update the conditions
      await this.conditionsRepository.update({ id: conditions.id }, updateDto);

      return await this.findOne(conditions.id);
    } catch (error) {
      // If conditions don't exist, create them
      if (error instanceof NotFoundException) {
        return this.create({
          clientId,
          ...updateDto,
        } as CreateClientCommercialConditionDto);
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.code === '23503') {
        // Handle foreign key constraint violations
        if (error.detail?.includes('assignedExecutiveId')) {
          throw new BadRequestException(
            `User with ID ${updateDto.assignedExecutiveId} does not exist`,
          );
        }
        if (error.detail?.includes('collectionExecutiveId')) {
          throw new BadRequestException(
            `User with ID ${updateDto.collectionExecutiveId} does not exist`,
          );
        }
      }

      throw new InternalServerErrorException(
        'Error updating commercial conditions',
      );
    }
  }

  async remove(id: string): Promise<ClientCommercialCondition> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const conditions = await this.findOne(id);
      await this.conditionsRepository.update({ id }, { isActive: false });
      return conditions;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error removing commercial conditions',
      );
    }
  }
}
