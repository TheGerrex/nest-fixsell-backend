import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const client = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(client);
    } catch (error) {
      // Duplicate key error example for Postgres
      if (error?.code === '23505') {
        throw new ConflictException(
          'Client with the same unique field already exists',
        );
      }
      // If validation or other database error
      throw new InternalServerErrorException('Error creating client');
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      return await this.clientRepository.find({
        where: { isActive: true },
        relations: [
          'accounts',
          'accounts.paymentComplementInfo',
          'clientPrinters',
          'clientPrinters.printer',
          'contacts',
          'shippingAddresses',
          'billingAddresses',
          'suspensionConfig',
          'commercialConditions',
          'commercialConditions.assignedExecutive',
          'commercialConditions.collectionExecutive',
          'classifications',
        ],
      });
    } catch (error) {
      console.error('Error retrieving clients:', error);
      throw new InternalServerErrorException('Error retrieving clients');
    }
  }

  async findOne(id: string): Promise<Client> {
    // Validate UUID before querying
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    try {
      const client = await this.clientRepository.findOne({
        where: {
          id,
          isActive: true,
        },
        relations: [
          'accounts',
          'accounts.paymentComplementInfo',
          'clientPrinters',
          'clientPrinters.printer',
          'contacts',
          'shippingAddresses',
          'billingAddresses',
          'suspensionConfig',
          'commercialConditions',
          'commercialConditions.assignedExecutive',
          'commercialConditions.collectionExecutive',
          'classifications',
        ],
      });

      if (!client) {
        throw new NotFoundException(`Client with id ${id} not found`);
      }
      return client;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving client:', error);
      throw new InternalServerErrorException('Error retrieving client');
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    // Validate UUID before updating
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    try {
      // Ensure the client exists before updating
      await this.findOne(id);

      const updateResult = await this.clientRepository.update(
        { id },
        updateClientDto,
      );
      if (!updateResult.affected) {
        throw new NotFoundException(
          `Client with id ${id} not found during update`,
        );
      }
      return await this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating client');
    }
  }

  async remove(id: string): Promise<Client> {
    // Validate UUID before removing
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    try {
      const client = await this.findOne(id);
      const updateResult = await this.clientRepository.update(
        { id },
        { isActive: false },
      );
      if (!updateResult.affected) {
        throw new NotFoundException(
          `Client with id ${id} not found during remove`,
        );
      }
      return client;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error removing client');
    }
  }
}
