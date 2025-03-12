import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientShippingAddress } from './entities/client-shipping-address.entity';
import { CreateClientShippingAddressDto } from './dto/create-client-shipping-address.dto';
import { UpdateClientShippingAddressDto } from './dto/update-client-shipping-address.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ClientShippingAddressesService {
  constructor(
    @InjectRepository(ClientShippingAddress)
    private readonly addressRepository: Repository<ClientShippingAddress>,
    private dataSource: DataSource,
  ) {}

  async create(
    createAddressDto: CreateClientShippingAddressDto,
  ): Promise<ClientShippingAddress> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { clientId, isDefault } = createAddressDto;

      // If this address is set as default, unset any existing default addresses
      if (isDefault) {
        await queryRunner.manager.update(
          ClientShippingAddress,
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
      console.error('Error creating shipping address:', error);
      if (error.code === '23505') {
        throw new ConflictException(
          'Address with those details already exists',
        );
      }
      throw new InternalServerErrorException('Error creating shipping address');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(clientId?: string): Promise<ClientShippingAddress[]> {
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

  async findOne(id: string): Promise<ClientShippingAddress> {
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
        throw new NotFoundException(`Shipping address with ID ${id} not found`);
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
    updateAddressDto: UpdateClientShippingAddressDto,
  ): Promise<ClientShippingAddress> {
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
          ClientShippingAddress,
          { clientId: address.clientId, isDefault: true },
          { isDefault: false },
        );
      }

      // Update the address
      await queryRunner.manager.update(
        ClientShippingAddress,
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

  async remove(id: string): Promise<ClientShippingAddress> {
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
