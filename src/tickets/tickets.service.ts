import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    console.log('Received DTO:', createTicketDto);

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

    // Use the UUIDs directly
    const assignedUserId = createTicketDto.assigned;
    console.log('Assigned User ID:', assignedUserId);
    const assigneeUserId = createTicketDto.assignee;
    console.log('Assignee User ID:', assigneeUserId);

    // checks if users exist
    const assignedUser = await this.userRepository.findOneBy({
      id: assignedUserId.toString(),
    });
    const assigneeUser = await this.userRepository.findOneBy({
      id: assignedUserId.toString(),
    });

    console.log('Assigned User:', assignedUser);
    console.log('Assignee User:', assigneeUser);

    if (!assignedUser) {
      throw new NotFoundException('Assigned user not found');
    }

    if (!assigneeUser) {
      throw new NotFoundException('Assignee user not found');
    }

    const newTicket = this.ticketRepository.create({
      ...createTicketDto,
      assigned: assignedUser, // Use the entire User object
      assignee: assigneeUser, // Use the entire User object
      activities: createTicketDto.activities, // Change the type of activities to string[]
    });

    console.log('New Ticket:', newTicket);

    try {
      await this.ticketRepository.save(newTicket);
    } catch (err) {
      throw new BadRequestException('Error saving the ticket');
    }

    return newTicket;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      relations: ['assigned', 'assignee', 'activities', 'activities.addedBy'],
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
      relations: ['assigned', 'assignee', 'activities', 'activities.addedBy'],
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    // Log the updateTicketDto object
    console.log('updateTicketDto:', updateTicketDto);
    console.log('Updating ticket with ID:', id);

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

    let updateData = { ...updateTicketDto };

    // Assigned user update
    if (updateTicketDto.assigned) {
      const assignedUserId = updateTicketDto.assigned;
      const assignedUser = await this.userRepository.findOneBy({
        id: assignedUserId.toString(),
      });
      if (!assignedUser) {
        throw new NotFoundException(
          `Assigned user not found with id: ${assignedUserId}`,
        );
      }
      updateData = { ...updateData, assigned: assignedUser };
    }

    // Assignee user update
    if (updateTicketDto.assignee) {
      const assigneeUserId = updateTicketDto.assignee;
      const assigneeUser = await this.userRepository.findOneBy({
        id: assigneeUserId.toString(),
      });

      if (!assigneeUser) {
        throw new NotFoundException(
          `Assignee user not found with id: ${assigneeUserId}`,
        );
      }

      updateData = { ...updateData, assignee: assigneeUser };
    }

    // Ticket activity update
    if (updateTicketDto.activities) {
      updateData = { ...updateData, activities: updateTicketDto.activities };
    }

    // Ticket priority update
    if (updateTicketDto.priority) {
      updateData = { ...updateData, priority: updateTicketDto.priority };
    }

    // Update the ticket
    await this.ticketRepository.update(id, updateData);

    console.log('Ticket updated successfully with:', updateData);

    const updatedTicket = await this.ticketRepository.findOneBy({ id });

    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }

    return updatedTicket;
  }

  async remove(id: number): Promise<string> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket con ID "${id}" no encontrado`);
    }
    return `Ticket con ID "${id}" eliminado correctamente`;
  }
}
