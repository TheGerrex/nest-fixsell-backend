import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPrinter } from './entities/client-printer.entity';
import { CreateClientPrinterDto } from './dto/create-client-printer.dto';
import { UpdateClientPrinterDto } from './dto/update-client-printer.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class ClientPrintersService {
  constructor(
    @InjectRepository(ClientPrinter)
    private readonly clientPrinterRepository: Repository<ClientPrinter>,
  ) {}

  async create(
    createClientPrinterDto: CreateClientPrinterDto,
  ): Promise<ClientPrinter> {
    try {
      const clientPrinter = this.clientPrinterRepository.create(
        createClientPrinterDto,
      );
      return await this.clientPrinterRepository.save(clientPrinter);
    } catch (error) {
      throw new InternalServerErrorException('Error creating client printer');
    }
  }

  async findAll(): Promise<ClientPrinter[]> {
    return await this.clientPrinterRepository.find();
  }

  async findOne(id: string): Promise<ClientPrinter> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const clientPrinter = await this.clientPrinterRepository.findOneBy({ id });
    if (!clientPrinter) {
      throw new NotFoundException(`Client Printer with ID ${id} not found`);
    }
    return clientPrinter;
  }

  async update(
    id: string,
    updateClientPrinterDto: UpdateClientPrinterDto,
  ): Promise<ClientPrinter> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    await this.findOne(id);
    const updateResult = await this.clientPrinterRepository.update(
      { id },
      updateClientPrinterDto,
    );
    if (!updateResult.affected) {
      throw new NotFoundException(
        `Client Printer with ID ${id} not found during update`,
      );
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<ClientPrinter> {
    if (!isUUID(id)) {
      throw new BadRequestException(`Invalid UUID format: ${id}`);
    }
    const clientPrinter = await this.findOne(id);
    const deleteResult = await this.clientPrinterRepository.delete({ id });
    if (deleteResult.affected === 0) {
      throw new NotFoundException(
        `Client Printer with ID ${id} not found during deletion`,
      );
    }
    return clientPrinter;
  }
}
