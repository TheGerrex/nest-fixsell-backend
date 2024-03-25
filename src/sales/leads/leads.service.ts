import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead } from './entities/lead.entity';
import { User } from 'src/auth/entities/user.entity';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { SaleCommunication } from '../sale-communication/entities/sale-communication.entity';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SaleCommunication)
    private readonly SaleCommunicationRepository: Repository<SaleCommunication>,
  ) {}
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    // Get all vendors with their assigned leads
    const vendors = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.leads', 'lead')
      .where('role.name = :roleName', { roleName: 'vendor' })
      .getMany();

    // If there are no vendors, throw an error
    if (!vendors.length) {
      throw new NotFoundException('No vendor found');
    }

    // Sort vendors by the number of assigned leads in ascending order
    vendors.sort((a, b) => a.leads.length - b.leads.length);

    // Select the vendor with the least number of assigned leads
    const selectedVendor = vendors[0];

    // creates a new lead and assigns it to a vendor at random balancing the load
    const lead = this.leadRepository.create({
      ...createLeadDto,
      assigned: selectedVendor,
    });
    return this.leadRepository.save(lead);
  }

  async findAll() {
    // returns all leads with their communications
    return this.leadRepository.find({ relations: ['communications'] });
  }

  async findOne(id: string, name?: string) {
    let lead;

    if (id) {
      lead = await this.leadRepository.findOne({
        where: { id: Number(id) }, // Convert id to a number
        relations: ['assigned', 'communications'],
      });
    } else if (name) {
      lead = await this.leadRepository
        .createQueryBuilder('lead')
        .leftJoinAndSelect('lead.assigned', 'assigned')
        .leftJoinAndSelect('lead.communications', 'communications')
        .where('UPPER(lead.name) = :name', {
          name: name.toUpperCase(),
        })
        .getOne();
    }

    if (!lead) {
      throw new NotFoundException(`Lead not found`);
    }

    return lead;
  }

  async update(id: number, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
      where: { id: Number(id) }, // Convert id to a number
      relations: ['assigned', 'communications'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }

    Object.assign(lead, updateLeadDto);

    return this.leadRepository.save(lead);
  }

  async remove(id: number): Promise<{ message: string }> {
    const lead = await this.leadRepository.findOne({
      where: { id: Number(id) }, // Convert id to a number
      relations: ['assigned', 'communications'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }

    const leadId = lead.id;
    const clientName = lead.client;

    await this.leadRepository.remove(lead); // Fix: Replace the string argument with the lead object

    return {
      message: `Lead with id ${leadId} and client name ${clientName} removed successfully`,
    };
  }
}
