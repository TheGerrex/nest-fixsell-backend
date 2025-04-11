import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead } from './entities/lead.entity';
import { User } from 'src/auth/entities/user.entity';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { SaleCommunication } from '../sale-communication/entities/sale-communication.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SaleCommunication)
    private readonly SaleCommunicationRepository: Repository<SaleCommunication>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    try {
      this.logger.log(
        `Creating lead with data: ${JSON.stringify(createLeadDto)}`,
      );

      // Get all vendors with the canBeAssignedToLead permission
      const vendorsQuery = this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .leftJoinAndSelect('role.permission', 'permission')
        .leftJoinAndSelect('user.leads', 'lead')
        .where('permission.canBeAssignedToLead = :canBeAssignedToLead', {
          canBeAssignedToLead: true,
        });

      this.logger.debug(
        `Executing vendor query: ${vendorsQuery.getQueryAndParameters()[0]}`,
      );
      const vendors = await vendorsQuery.getMany();

      this.logger.log(
        `Found ${vendors.length} vendors with canBeAssignedToLead permission`,
      );

      // If there are no vendors, log a message
      if (!vendors.length) {
        this.logger.warn(
          'No vendor found with the canBeAssignedToLead permission. Lead creation aborted.',
        );
        return null;
      }

      // Log vendor details for debugging
      vendors.forEach((vendor, index) => {
        this.logger.debug(
          `Vendor #${index + 1}: ID=${vendor.id}, Name=${
            vendor.name
          }, Lead Count=${vendor.leads?.length || 0}`,
        );
      });

      // Sort vendors by the number of assigned leads in ascending order
      vendors.sort((a, b) => (a.leads?.length || 0) - (b.leads?.length || 0));

      // Select the vendor with the least number of assigned leads
      const selectedVendor = vendors[0];
      this.logger.log(
        `Selected vendor for assignment: ID=${selectedVendor.id}, Name=${selectedVendor.name}`,
      );

      // Create a new lead and assign it to the selected vendor
      const lead = this.leadRepository.create({
        ...createLeadDto,
        assigned: selectedVendor,
      });

      this.logger.debug(`Lead entity created: ${JSON.stringify(lead)}`);

      try {
        this.logger.log('Attempting to save lead to database...');
        const savedLead = await this.leadRepository.save(lead);
        this.logger.log(`Lead successfully saved with ID: ${savedLead.id}`);

        // Emit an event for lead creation notification
        this.eventEmitter.emit('lead.created', { lead: savedLead });

        return savedLead;
      } catch (dbError) {
        this.logger.error(
          `Database error while saving lead: ${dbError.message}`,
        );
        this.logger.error(dbError.stack);
        throw dbError;
      }
    } catch (error) {
      this.logger.error(`Error in create lead method: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async findAll() {
    //returns all leads with that assigned user

    // returns all leads with their communications and assigned users
    return this.leadRepository.find({
      relations: ['communications', 'assigned'],
    });
  }

  async findAllByVendor(vendorId: string) {
    // Find the vendor with the given vendorId
    const vendor = await this.userRepository.findOne({
      where: { id: vendorId },
      relations: ['leads'],
    });

    // If the vendor does not exist, throw an error
    if (!vendor) {
      throw new NotFoundException(`Vendor #${vendorId} not found`);
    }

    // Load the 'assigned' and 'communications' relations for each lead
    const leads = await Promise.all(
      vendor.leads.map(async (lead) => {
        return this.leadRepository.findOne({
          where: { id: lead.id },
          relations: ['assigned', 'communications'],
        });
      }),
    );

    // Return the leads assigned to the vendor
    return leads;
  }

  async findOne(id: string, name?: string) {
    let lead;

    if (id) {
      const numericId = Number(id);
      if (isNaN(numericId)) {
        throw new BadRequestException(`Invalid lead ID format: ${id}`);
      }

      lead = await this.leadRepository.findOne({
        where: { id: numericId },
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
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(`Invalid lead ID format: ${id}`);
    }

    const lead = await this.leadRepository.findOne({
      where: { id: numericId },
      relations: ['assigned', 'communications'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }

    // Store the previous assigned user ID for comparison
    const previousAssignedId = lead.assigned?.id;

    // Apply updates
    Object.assign(lead, updateLeadDto);

    // Save the updated lead
    const updatedLead = await this.leadRepository.save(lead);

    // If a lead is assigned to a different user, emit a lead.assigned event
    if (
      updateLeadDto.assigned &&
      previousAssignedId !== updateLeadDto.assigned
    ) {
      this.eventEmitter.emit('lead.assigned', {
        lead: updatedLead,
        previousAssignedId,
      });
    }

    // Also emit a general update event
    this.eventEmitter.emit('lead.updated', {
      lead: updatedLead,
      changes: updateLeadDto,
    });

    return updatedLead;
  }

  async remove(id: number): Promise<{ message: string }> {
    const numericId = Number(id);
    if (isNaN(numericId)) {
      throw new BadRequestException(`Invalid lead ID format: ${id}`);
    }

    const lead = await this.leadRepository.findOne({
      where: { id: numericId },
      relations: ['assigned', 'communications'],
    });

    if (!lead) {
      throw new NotFoundException(`Lead #${id} not found`);
    }

    const leadId = lead.id;
    const clientName = lead.client;

    await this.leadRepository.remove(lead);

    return {
      message: `Lead with id ${leadId} and client name ${clientName} removed successfully`,
    };
  }
}
