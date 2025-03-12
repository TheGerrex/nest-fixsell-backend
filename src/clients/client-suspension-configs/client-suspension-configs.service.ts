import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientSuspensionConfig } from './entities/client-suspension-config.entity';
import { CreateClientSuspensionConfigDto } from './dto/create-client-suspension-config.dto';
import { UpdateClientSuspensionConfigDto } from './dto/update-client-suspension-config.dto';
import { isUUID } from 'class-validator';
import { Client } from '../entities/client.entity';

@Injectable()
export class ClientSuspensionConfigsService {
  constructor(
    @InjectRepository(ClientSuspensionConfig)
    private readonly configRepository: Repository<ClientSuspensionConfig>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(
    createConfigDto: CreateClientSuspensionConfigDto,
  ): Promise<ClientSuspensionConfig> {
    try {
      // First check if client exists
      const client = await this.clientRepository.findOne({
        where: { id: createConfigDto.clientId, isActive: true },
      });

      if (!client) {
        throw new NotFoundException(
          `Client with ID ${createConfigDto.clientId} not found`,
        );
      }

      // Check if a config already exists for this client
      const existingConfig = await this.configRepository.findOne({
        where: { clientId: createConfigDto.clientId },
      });

      if (existingConfig) {
        throw new ConflictException(
          `Suspension config for client ${createConfigDto.clientId} already exists. Use update instead.`,
        );
      }

      // Create the new config
      const config = this.configRepository.create(createConfigDto);
      const savedConfig = await this.configRepository.save(config);

      // Return with client relationship
      return await this.configRepository
        .createQueryBuilder('config')
        .leftJoinAndSelect('config.client', 'client')
        .where('config.id = :id', { id: savedConfig.id })
        .getOne();
    } catch (error) {
      console.error('Error creating client suspension config:', error);

      if (error.code === '23505') {
        throw new ConflictException(
          'Suspension config for this client already exists',
        );
      }

      if (error.code === '23503') {
        throw new BadRequestException(
          `Client with ID ${createConfigDto.clientId} does not exist`,
        );
      }

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error creating client suspension config',
      );
    }
  }

  async findAll(): Promise<ClientSuspensionConfig[]> {
    try {
      return await this.configRepository
        .createQueryBuilder('config')
        .leftJoinAndSelect('config.client', 'client')
        .where('config.isActive = :isActive', { isActive: true })
        .getMany();
    } catch (error) {
      console.error('Error retrieving suspension configs:', error);
      throw new InternalServerErrorException(
        'Error retrieving suspension configs',
      );
    }
  }

  async findOne(id: string): Promise<ClientSuspensionConfig> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const config = await this.configRepository
        .createQueryBuilder('config')
        .leftJoinAndSelect('config.client', 'client')
        .where('config.id = :id', { id })
        .andWhere('config.isActive = :isActive', { isActive: true })
        .getOne();

      if (!config) {
        throw new NotFoundException(
          `Suspension config with ID ${id} not found`,
        );
      }

      return config;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving suspension config:', error);
      throw new InternalServerErrorException(
        'Error retrieving suspension config',
      );
    }
  }

  async findByClientId(clientId: string): Promise<ClientSuspensionConfig> {
    if (!isUUID(clientId)) {
      throw new BadRequestException(`Invalid UUID format: ${clientId}`);
    }

    try {
      const config = await this.configRepository
        .createQueryBuilder('config')
        .leftJoinAndSelect('config.client', 'client')
        .where('config.clientId = :clientId', { clientId })
        .andWhere('config.isActive = :isActive', { isActive: true })
        .getOne();

      if (!config) {
        throw new NotFoundException(
          `Suspension config for client ${clientId} not found`,
        );
      }

      return config;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving suspension config:', error);
      throw new InternalServerErrorException(
        'Error retrieving suspension config',
      );
    }
  }

  async update(
    id: string,
    updateConfigDto: UpdateClientSuspensionConfigDto,
  ): Promise<ClientSuspensionConfig> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      // First check if the config exists
      await this.findOne(id);

      // Update the config
      await this.configRepository.update({ id }, updateConfigDto);

      return await this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating suspension config',
      );
    }
  }

  async updateByClientId(
    clientId: string,
    updateConfigDto: UpdateClientSuspensionConfigDto,
  ): Promise<ClientSuspensionConfig> {
    if (!isUUID(clientId)) {
      throw new BadRequestException(`Invalid UUID format: ${clientId}`);
    }

    try {
      // First check if the config exists
      const config = await this.findByClientId(clientId);

      // Update the config
      await this.configRepository.update({ id: config.id }, updateConfigDto);

      return await this.findOne(config.id);
    } catch (error) {
      // If config doesn't exist, create it
      if (error instanceof NotFoundException) {
        return this.create({
          clientId,
          ...updateConfigDto,
        } as CreateClientSuspensionConfigDto);
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error updating suspension config',
      );
    }
  }

  async remove(id: string): Promise<ClientSuspensionConfig> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const config = await this.findOne(id);
      await this.configRepository.update({ id }, { isActive: false });
      return config;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error removing suspension config',
      );
    }
  }
}
