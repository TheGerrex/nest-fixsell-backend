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

  async findAll() {
    //returns all saleCommunications
    return this.saleCommunicationRepository.find({
      relations: ['lead'],
    });
  }

  async findOne(id: string) {
    // Find the saleCommunication with the given id
    const saleCommunication = await this.saleCommunicationRepository.findOne({
      where: { id: Number(id) },
      relations: ['lead'],
    });

    // If the saleCommunication does not exist, throw an error
    if (!saleCommunication) {
      throw new NotFoundException(`SaleCommunication #${id} not found`);
    }

    return saleCommunication;
  }

  async update(
    id: string,
    updateSaleCommunicationDto: UpdateSaleCommunicationDto,
  ): Promise<SaleCommunication> {
    // Find the saleCommunication with the given id
    const saleCommunication = await this.saleCommunicationRepository.findOne({
      where: { id: Number(id) },
      relations: ['lead'],
    });

    // If the saleCommunication does not exist, throw an error
    if (!saleCommunication) {
      throw new NotFoundException(`SaleCommunication #${id} not found`);
    }

    // Merge the updateSaleCommunicationDto into the found saleCommunication
    Object.assign(saleCommunication, updateSaleCommunicationDto);

    // Save the updated saleCommunication
    return this.saleCommunicationRepository.save(saleCommunication);
  }

  async remove(id: string): Promise<{ message: string }> {
    // Find the saleCommunication with the given id
    const saleCommunication = await this.saleCommunicationRepository.findOne({
      where: { id: Number(id) },
      relations: ['lead'],
    });

    // If the saleCommunication does not exist, throw an error
    if (!saleCommunication) {
      throw new NotFoundException(`SaleCommunication #${id} not found`);
    }

    const saleCommunicationId = saleCommunication.id;

    // Remove the saleCommunication
    await this.saleCommunicationRepository.remove(saleCommunication);

    return {
      message: `SaleCommunication with id ${saleCommunicationId} removed successfully`,
    };
  }
}
