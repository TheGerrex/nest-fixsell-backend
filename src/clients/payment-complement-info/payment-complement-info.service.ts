import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaymentComplementInfo } from './entities/payment-complement-info.entity';
import { CreatePaymentComplementInfoDto } from './dto/create-payment-complement-info.dto';
import { UpdatePaymentComplementInfoDto } from './dto/update-payment-complement-info.dto';
import { isUUID } from 'class-validator';
import { ClientAccount } from '../client-accounts/entities/client-account.entity';

@Injectable()
export class PaymentComplementInfoService {
  constructor(
    @InjectRepository(PaymentComplementInfo)
    private readonly infoRepository: Repository<PaymentComplementInfo>,
    @InjectRepository(ClientAccount)
    private readonly clientAccountRepository: Repository<ClientAccount>,
    private dataSource: DataSource,
  ) {}

  async create(
    createDto: CreatePaymentComplementInfoDto,
  ): Promise<PaymentComplementInfo> {
    try {
      // First check if client account exists
      const clientAccount = await this.clientAccountRepository.findOne({
        where: { id: createDto.clientAccountId, isActive: true },
      });

      if (!clientAccount) {
        throw new NotFoundException(
          `Client account with ID ${createDto.clientAccountId} not found. Please provide a valid client account ID.`,
        );
      }

      const info = this.infoRepository.create(createDto);
      const savedInfo = await this.infoRepository.save(info);

      // Return with client account relationship
      return await this.infoRepository
        .createQueryBuilder('info')
        .leftJoinAndSelect('info.clientAccount', 'clientAccount')
        .leftJoinAndSelect('clientAccount.client', 'client')
        .where('info.id = :id', { id: savedInfo.id })
        .getOne();
    } catch (error) {
      console.error('Error creating payment complement info:', error);

      // Handle specific database errors
      if (error.code === '23505') {
        throw new ConflictException(
          'Payment complement info with those details already exists',
        );
      }

      if (error.code === '23503') {
        // Foreign key constraint violation
        if (error.detail?.includes('clientAccountId')) {
          throw new BadRequestException(
            `Client account with ID ${createDto.clientAccountId} does not exist. Please create the account first.`,
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
        'Error creating payment complement info',
      );
    }
  }

  async findAll(clientAccountId?: string): Promise<PaymentComplementInfo[]> {
    try {
      const query = this.infoRepository
        .createQueryBuilder('info')
        .leftJoinAndSelect('info.clientAccount', 'clientAccount')
        .leftJoinAndSelect('clientAccount.client', 'client')
        .where('info.isActive = :isActive', { isActive: true });

      if (clientAccountId) {
        query.andWhere('info.clientAccountId = :clientAccountId', {
          clientAccountId,
        });
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error retrieving payment complement info:', error);
      throw new InternalServerErrorException(
        'Error retrieving payment complement info',
      );
    }
  }

  async findOne(id: string): Promise<PaymentComplementInfo> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const info = await this.infoRepository
        .createQueryBuilder('info')
        .leftJoinAndSelect('info.clientAccount', 'clientAccount')
        .leftJoinAndSelect('clientAccount.client', 'client')
        .where('info.id = :id', { id })
        .andWhere('info.isActive = :isActive', { isActive: true })
        .getOne();

      if (!info) {
        throw new NotFoundException(
          `Payment complement info with ID ${id} not found`,
        );
      }

      return info;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving payment complement info:', error);
      throw new InternalServerErrorException(
        'Error retrieving payment complement info',
      );
    }
  }

  async update(
    id: string,
    updateDto: UpdatePaymentComplementInfoDto,
  ): Promise<PaymentComplementInfo> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      // First check if the info exists
      await this.findOne(id);

      // Update the info
      await this.infoRepository.update({ id }, updateDto);

      return await this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating payment complement info',
      );
    }
  }

  async remove(id: string): Promise<PaymentComplementInfo> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const info = await this.findOne(id);
      await this.infoRepository.update({ id }, { isActive: false });
      return info;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deactivating payment complement info',
      );
    }
  }
}
