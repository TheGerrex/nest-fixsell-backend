import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSaleCommunicationDto } from './dto/create-sale-communication.dto';
import { UpdateSaleCommunicationDto } from './dto/update-sale-communication.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SaleCommunication } from './entities/sale-communication.entity';
import { Lead } from '../leads/entities/lead.entity';
@Injectable()
export class SaleCommunicationService {
  constructor(
    @InjectRepository(SaleCommunication)
    private saleCommunicationRepository: Repository<SaleCommunication>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(createSaleCommunicationDto: CreateSaleCommunicationDto) {
    // Find the lead with the given leadId
    const lead = await this.leadRepository
      .createQueryBuilder('lead')
      .where('lead.id = :leadId', { leadId: createSaleCommunicationDto.leadId })
      .getOne();

    // If the lead does not exist, throw an error
    if (!lead) {
      throw new NotFoundException(
        `Lead #${createSaleCommunicationDto.leadId} not found`,
      );
    }

    // Create a new SaleCommunication and assign it to the found lead
    const saleCommunication = this.saleCommunicationRepository.create({
      ...createSaleCommunicationDto,
      lead: lead,
    });

    return this.saleCommunicationRepository.save(saleCommunication);
  }

  findAll() {
    return `This action returns all saleCommunication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} saleCommunication`;
  }

  update(id: number, updateSaleCommunicationDto: UpdateSaleCommunicationDto) {
    return `This action updates a #${id} saleCommunication`;
  }

  remove(id: number) {
    return `This action removes a #${id} saleCommunication`;
  }
}
