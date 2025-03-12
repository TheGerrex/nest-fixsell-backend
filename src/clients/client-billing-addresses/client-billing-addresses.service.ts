import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientBillingAddress } from './entities/client-billing-address.entity';
import { CreateClientBillingAddressDto } from './dto/create-client-billing-address.dto';
import { UpdateClientBillingAddressDto } from './dto/update-client-billing-address.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ClientBillingAddressesService {
  constructor(
    @InjectRepository(ClientBillingAddress)
    private readonly addressRepository: Repository<ClientBillingAddress>,
    private dataSource: DataSource,
  ) {}

  async create(
    createAddressDto: CreateClientBillingAddressDto,
  ): Promise<ClientBillingAddress> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clientId, isDefault } = createAddressDto;

      // If this address is set as default, unset any existing default addresses
      if (isDefault) {
        await queryRunner.manager.update(
          ClientBillingAddress,
          { clientId, isDefault: true },
          { isDefault: false },
        );
      }

      // Create the new address
      const address = this.addressRepository.create(createAddressDto);
      const savedAddress = await queryRunner.manager.save(address);

      await queryRunner.commitTransaction();

      // Return with client relationship
      return await this.addressRepository
        .createQueryBuilder('address')
        .leftJoinAndSelect('address.client', 'client')
        .where('address.id = :id', { id: savedAddress.id })
        .getOne();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating billing address:', error);
      if (error.code === '23505') {
        throw new ConflictException(
          'Address with those details already exists',
        );
      }
      throw new InternalServerErrorException('Error creating billing address');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(clientId?: string): Promise<ClientBillingAddress[]> {
    try {
      const query = this.addressRepository
        .createQueryBuilder('address')
        .leftJoinAndSelect('address.client', 'client')
        .where('address.isActive = :isActive', { isActive: true });

      if (clientId) {
        query.andWhere('address.clientId = :clientId', { clientId });
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error retrieving addresses:', error);
      throw new InternalServerErrorException('Error retrieving addresses');
    }
  }

  async findOne(id: string): Promise<ClientBillingAddress> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const address = await this.addressRepository
        .createQueryBuilder('address')
        .leftJoinAndSelect('address.client', 'client')
        .where('address.id = :id', { id })
        .andWhere('address.isActive = :isActive', { isActive: true })
        .getOne();

      if (!address) {
        throw new NotFoundException(`Billing address with ID ${id} not found`);
      }

      return address;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving address:', error);
      throw new InternalServerErrorException('Error retrieving address');
    }
  }

  async update(
    id: string,
    updateAddressDto: UpdateClientBillingAddressDto,
  ): Promise<ClientBillingAddress> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First check if the address exists
      const address = await this.findOne(id);

      // Handle default flag updates
      if (updateAddressDto.isDefault) {
        await queryRunner.manager.update(
          ClientBillingAddress,
          { clientId: address.clientId, isDefault: true },
          { isDefault: false },
        );
      }

      // Update the address
      await queryRunner.manager.update(
        ClientBillingAddress,
        { id },
        updateAddressDto,
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
      throw new InternalServerErrorException('Error updating address');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<ClientBillingAddress> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const address = await this.findOne(id);
      await this.addressRepository.update({ id }, { isActive: false });
      return address;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error deactivating address');
    }
  }
}
