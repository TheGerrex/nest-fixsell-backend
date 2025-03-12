import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Client } from '../entities/client.entity';
import { ClientClassification } from './entities/client-classification.entity';
import { CreateClientClassificationDto } from './dto/create-client-classification.dto';
import { UpdateClientClassificationDto } from './dto/update-client-classification.dto';

@Injectable()
export class ClientClassificationsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(ClientClassification)
    private readonly classificationRepository: Repository<ClientClassification>,
  ) {}

  async create(
    dto: CreateClientClassificationDto,
  ): Promise<ClientClassification> {
    // Validate client id format
    if (!isUUID(dto.clientId)) {
      throw new BadRequestException(
        `Invalid client ID format: ${dto.clientId}`,
      );
    }
    // Check if the client exists and is active
    const client = await this.clientRepository.findOne({
      where: { id: dto.clientId, isActive: true },
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${dto.clientId} not found`);
    }
    // Optionally, check if the client already has a classification record
    const existing = await this.classificationRepository.findOne({
      where: { clientId: dto.clientId },
    });
    if (existing) {
      throw new ConflictException(
        `Client classification already exists for client ID ${dto.clientId}`,
      );
    }
    const classification = this.classificationRepository.create(dto);
    return await this.classificationRepository.save(classification);
  }

  async findAll(): Promise<ClientClassification[]> {
    return await this.classificationRepository.find({
      relations: ['client'],
    });
  }

  async findOne(id: string): Promise<ClientClassification> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid classification ID format: ${id}`);
    }
    const classification = await this.classificationRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    if (!classification) {
      throw new NotFoundException(
        `ClientClassification with ID ${id} not found`,
      );
    }
    return classification;
  }

  async update(
    id: string,
    dto: UpdateClientClassificationDto,
  ): Promise<ClientClassification> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid classification ID format: ${id}`);
    }
    const classification = await this.classificationRepository.findOne({
      where: { id },
    });
    if (!classification) {
      throw new NotFoundException(
        `ClientClassification with ID ${id} not found`,
      );
    }
    // Update only provided fields
    if (dto.businessGroupId !== undefined) {
      classification.businessGroupId = dto.businessGroupId;
    }
    if (dto.collectionZoneId !== undefined) {
      classification.collectionZoneId = dto.collectionZoneId;
    }
    if (dto.clientCategoryId !== undefined) {
      classification.clientCategoryId = dto.clientCategoryId;
    }
    if (dto.businessLineId !== undefined) {
      classification.businessLineId = dto.businessLineId;
    }
    if (dto.branchOfficeId !== undefined) {
      classification.branchOfficeId = dto.branchOfficeId;
    }
    return await this.classificationRepository.save(classification);
  }

  async remove(id: string): Promise<void> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid classification ID format: ${id}`);
    }
    const classification = await this.classificationRepository.findOne({
      where: { id },
    });
    if (!classification) {
      throw new NotFoundException(
        `ClientClassification with ID ${id} not found`,
      );
    }
    await this.classificationRepository.remove(classification);
  }
}
