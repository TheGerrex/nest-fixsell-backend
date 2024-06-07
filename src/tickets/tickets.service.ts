import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    console.log('Before conversion:', createTicketDto);

    try {
      createTicketDto.appointmentStartTime = new Date(
        createTicketDto.appointmentStartTime,
      );
      createTicketDto.appointmentEndTime = new Date(
        createTicketDto.appointmentEndTime,
      );
    } catch (err) {
      console.error('Error during date conversion:', err);
    }

    console.log('After conversion:', createTicketDto);

    // checks if users exist
    const assignedUser = await this.userRepository.findOne({
      where: { id: createTicketDto.assigned },
    });
    const assigneeUser = await this.userRepository.findOne({
      where: { id: createTicketDto.assignee },
    });

    if (!assignedUser) {
      throw new BadRequestException('Assigned user not found');
    }

    if (!assigneeUser) {
      throw new BadRequestException('Assignee user not found');
    }

    const newTicket = this.ticketRepository.create({
      ...createTicketDto,
      assigned: assignedUser,
      assignee: assigneeUser,
      activity: [createTicketDto.activity], // Change the type of activity to string[]
    });

    try {
      await this.ticketRepository.save(newTicket);
    } catch (err) {
      throw new BadRequestException('Error while saving ticket');
    }

    return newTicket;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      relations: ['assigned', 'assignee'],
    });
  }

  async findAllAssignedToUser(userId: string): Promise<Ticket[]> {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.assigned', 'assigned')
      .where('assigned.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: number): Promise<Ticket> {
    return await this.ticketRepository.findOne({
      where: { id: id },
      relations: ['assigned', 'assignee'],
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    // Log the updateTicketDto object
    console.log('updateTicketDto:', updateTicketDto);
    console.log('Updating ticket with ID:', id);
    console.log('Update data:', updateTicketDto);
    // Convert appointment start and end times to Date objects if they are not null
    if (updateTicketDto.appointmentStartTime) {
      updateTicketDto.appointmentStartTime = new Date(
        updateTicketDto.appointmentStartTime,
      );
    }
    if (updateTicketDto.appointmentEndTime) {
      updateTicketDto.appointmentEndTime = new Date(
        updateTicketDto.appointmentEndTime,
      );
    }

    // Log the converted dates
    console.log(
      'Converted appointmentStartTime:',
      updateTicketDto.appointmentStartTime,
    );
    console.log(
      'Converted appointmentEndTime:',
      updateTicketDto.appointmentEndTime,
    );

    const assignedUser = await this.userRepository.findOne({
      where: { id: updateTicketDto.assigned },
    });
    const assigneeUser = await this.userRepository.findOne({
      where: { id: updateTicketDto.assignee },
    });

    if (!assignedUser) {
      throw new BadRequestException('Assigned user not found');
    }

    if (!assigneeUser) {
      throw new BadRequestException('Assignee user not found');
    }

    // Exclude assigned and assignee from the updateTicketDto object
    const { assigned, assignee, ...updateData } = updateTicketDto;

    await this.ticketRepository.update(id, {
      ...updateData,
      assigned: assignedUser,
      assignee: assigneeUser,
      activity: updateTicketDto.activity
        ? [updateTicketDto.activity]
        : undefined, // Change the type of activity to string[]
    });

    console.log('Ticket updated successfully with:0', updateData);

    const updatedTicket = await this.ticketRepository.findOne({
      where: { id: id },
    });

    if (!updatedTicket) {
      throw new BadRequestException('Ticket not found');
    }

    return updatedTicket;
  }

  async remove(id: number): Promise<string> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`Ticket with ID "${id}" not found`);
    }
    return `Ticket with ID "${id}" was successfully removed`;
  }
}
