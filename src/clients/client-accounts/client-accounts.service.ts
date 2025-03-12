import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientAccount } from './entities/client-account.entity';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ClientAccountsService {
  constructor(
    @InjectRepository(ClientAccount)
    private readonly accountRepository: Repository<ClientAccount>,
    private dataSource: DataSource,
  ) {}

  async create(
    createClientAccountDto: CreateClientAccountDto,
  ): Promise<ClientAccount> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clientId, isDefault } = createClientAccountDto;

      // If this account is set as default, unset any existing default accounts
      if (isDefault) {
        await queryRunner.manager.update(
          ClientAccount,
          { clientId, isDefault: true },
          { isDefault: false },
        );
      }

      // Create the new account
      const account = this.accountRepository.create(createClientAccountDto);
      const savedAccount = await queryRunner.manager.save(account);

      await queryRunner.commitTransaction();

      // Use query builder to ensure proper relation loading
      return await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.client', 'client')
        .where('account.id = :id', { id: savedAccount.id })
        .getOne();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating client account:', error);
      if (error.code === '23505') {
        throw new ConflictException(
          'Account with those details already exists',
        );
      }
      throw new InternalServerErrorException('Error creating client account');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(clientId?: string): Promise<ClientAccount[]> {
    try {
      const query = this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.client', 'client')
        .where('account.isActive = :isActive', { isActive: true });

      if (clientId) {
        query.andWhere('account.clientId = :clientId', { clientId });
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error retrieving accounts:', error);
      throw new InternalServerErrorException('Error retrieving accounts');
    }
  }

  async findOne(id: string): Promise<ClientAccount> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const account = await this.accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.client', 'client')
        .where('account.id = :id', { id })
        .andWhere('account.isActive = :isActive', { isActive: true })
        .getOne();

      if (!account) {
        throw new NotFoundException(`Account with ID ${id} not found`);
      }

      return account;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving account:', error);
      throw new InternalServerErrorException('Error retrieving account');
    }
  }

  async update(
    id: string,
    updateClientAccountDto: UpdateClientAccountDto,
  ): Promise<ClientAccount> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First check if the account exists
      const account = await this.findOne(id);

      // Handle default flag updates
      if (updateClientAccountDto.isDefault) {
        await queryRunner.manager.update(
          ClientAccount,
          { clientId: account.clientId, isDefault: true },
          { isDefault: false },
        );
      }

      // Update the account
      await queryRunner.manager.update(
        ClientAccount,
        { id },
        updateClientAccountDto,
      );

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating account');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<ClientAccount> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const account = await this.findOne(id);
      await this.accountRepository.update({ id }, { isActive: false });
      return account;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error deactivating account');
    }
  }
}
