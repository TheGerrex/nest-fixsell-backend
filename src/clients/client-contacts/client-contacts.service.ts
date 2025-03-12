import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientContact } from './entities/client-contact.entity';
import { CreateClientContactDto } from './dto/create-client-contact.dto';
import { UpdateClientContactDto } from './dto/update-client-contact.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ClientContactsService {
  constructor(
    @InjectRepository(ClientContact)
    private readonly contactRepository: Repository<ClientContact>,
    private dataSource: DataSource,
  ) {}

  async create(
    createContactDto: CreateClientContactDto,
  ): Promise<ClientContact> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const {
        clientId,
        isDefault,
        isBillingContact,
        isPaymentComplementContact,
      } = createContactDto;

      // Handle defaults based on contact type
      if (isDefault) {
        await queryRunner.manager.update(
          ClientContact,
          { clientId, isDefault: true },
          { isDefault: false },
        );
      }

      if (isBillingContact) {
        await queryRunner.manager.update(
          ClientContact,
          { clientId, isBillingContact: true },
          { isBillingContact: false },
        );
      }

      if (isPaymentComplementContact) {
        await queryRunner.manager.update(
          ClientContact,
          { clientId, isPaymentComplementContact: true },
          { isPaymentComplementContact: false },
        );
      }

      // Create the new contact
      const contact = this.contactRepository.create(createContactDto);
      const savedContact = await queryRunner.manager.save(contact);

      await queryRunner.commitTransaction();

      // Return with client relationship
      return await this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.client', 'client')
        .where('contact.id = :id', { id: savedContact.id })
        .getOne();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating client contact:', error);
      if (error.code === '23505') {
        throw new ConflictException(
          'Contact with those details already exists',
        );
      }
      throw new InternalServerErrorException('Error creating client contact');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(clientId?: string): Promise<ClientContact[]> {
    try {
      const query = this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.client', 'client')
        .where('contact.isActive = :isActive', { isActive: true });

      if (clientId) {
        query.andWhere('contact.clientId = :clientId', { clientId });
      }

      return await query.getMany();
    } catch (error) {
      console.error('Error retrieving contacts:', error);
      throw new InternalServerErrorException('Error retrieving contacts');
    }
  }

  async findOne(id: string): Promise<ClientContact> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const contact = await this.contactRepository
        .createQueryBuilder('contact')
        .leftJoinAndSelect('contact.client', 'client')
        .where('contact.id = :id', { id })
        .andWhere('contact.isActive = :isActive', { isActive: true })
        .getOne();

      if (!contact) {
        throw new NotFoundException(`Contact with ID ${id} not found`);
      }

      return contact;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error retrieving contact:', error);
      throw new InternalServerErrorException('Error retrieving contact');
    }
  }

  async update(
    id: string,
    updateContactDto: UpdateClientContactDto,
  ): Promise<ClientContact> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // First check if the contact exists
      const contact = await this.findOne(id);
      const { isDefault, isBillingContact, isPaymentComplementContact } =
        updateContactDto;

      // Handle default flags
      if (isDefault) {
        await queryRunner.manager.update(
          ClientContact,
          { clientId: contact.clientId, isDefault: true },
          { isDefault: false },
        );
      }

      if (isBillingContact) {
        await queryRunner.manager.update(
          ClientContact,
          { clientId: contact.clientId, isBillingContact: true },
          { isBillingContact: false },
        );
      }

      if (isPaymentComplementContact) {
        await queryRunner.manager.update(
          ClientContact,
          { clientId: contact.clientId, isPaymentComplementContact: true },
          { isPaymentComplementContact: false },
        );
      }

      // Update the contact
      await queryRunner.manager.update(ClientContact, { id }, updateContactDto);

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
      throw new InternalServerErrorException('Error updating contact');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<ClientContact> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }

    try {
      const contact = await this.findOne(id);
      await this.contactRepository.update({ id }, { isActive: false });
      return contact;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error deactivating contact');
    }
  }
}
