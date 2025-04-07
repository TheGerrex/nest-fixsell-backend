import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { User } from '../auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
@Injectable()
export class TicketsService {
  private readonly logger = new Logger(TicketsService.name);

  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    console.log('Received DTO:', createTicketDto);

    // Set default dates if not provided or invalid
    const now = new Date();
    let startTime = now;
    let endTime = new Date(now.getTime() + 60 * 60 * 1000); // Default 1 hour later

    // Try to parse dates if provided
    if (createTicketDto.appointmentStartTime) {
      const parsedDate = new Date(createTicketDto.appointmentStartTime);
      if (!isNaN(parsedDate.getTime())) {
        startTime = parsedDate;
      } else {
        console.log(
          'Invalid appointmentStartTime provided, using current time',
        );
      }
    } else {
      console.log('No appointmentStartTime provided, using current time');
    }

    if (createTicketDto.appointmentEndTime) {
      const parsedDate = new Date(createTicketDto.appointmentEndTime);
      if (!isNaN(parsedDate.getTime())) {
        endTime = parsedDate;
      } else {
        console.log(
          'Invalid appointmentEndTime provided, using default end time',
        );
      }
    } else {
      console.log('No appointmentEndTime provided, using default end time');
    }

    createTicketDto.appointmentStartTime = startTime;
    createTicketDto.appointmentEndTime = endTime;

    console.log('After conversion:', createTicketDto);

    // Handle user assignments - make them optional
    let assignedUser = null;
    let assigneeUser = null;

    if (createTicketDto.assigned) {
      console.log('Assigned User ID:', createTicketDto.assigned);
      assignedUser = await this.userRepository.findOneBy({
        id: createTicketDto.assigned.toString(),
      });

      if (!assignedUser) {
        console.log(
          `Assigned user not found with id: ${createTicketDto.assigned}`,
        );
      }
    } else {
      console.log('No assigned user provided');
    }

    if (createTicketDto.assignee) {
      console.log('Assignee User ID:', createTicketDto.assignee);
      assigneeUser = await this.userRepository.findOneBy({
        id: createTicketDto.assignee.toString(),
      });

      if (!assigneeUser) {
        console.log(
          `Assignee user not found with id: ${createTicketDto.assignee}`,
        );
      }
    } else {
      console.log('No assignee user provided');
    }

    // If both assigned and assignee are not provided or not found, select a random user
    if (!assignedUser || !assigneeUser) {
      try {
        console.log('Finding random user for assignment');
        const users = await this.userRepository.find({ take: 10 }); // Limit to 10 to prevent loading too many users

        if (users.length > 0) {
          // Select a random user
          const randomUser = users[Math.floor(Math.random() * users.length)];
          console.log(
            `Selected random user: ${randomUser.id} - ${
              randomUser.name || randomUser.email
            }`,
          );

          // Assign to both if not already assigned
          if (!assignedUser) {
            assignedUser = randomUser;
            console.log(`Assigned user set to random user: ${randomUser.id}`);
          }
          if (!assigneeUser) {
            assigneeUser = randomUser;
            console.log(`Assignee user set to random user: ${randomUser.id}`);
          }
        } else {
          console.log('No users found in database for random assignment');
        }
      } catch (error) {
        console.error('Error selecting random user:', error);
        // Continue without assignment if there's an error
      }
    }

    const newTicket = this.ticketRepository.create({
      ...createTicketDto,
      assigned: assignedUser, // May be null or a random user
      assignee: assigneeUser, // May be null or a random user
      activities: createTicketDto.activities || [], // Ensure activities are properly initialized
    });

    console.log('New Ticket:', newTicket);

    try {
      await this.ticketRepository.save(newTicket);
    } catch (err) {
      console.error('Error saving ticket:', err);
      throw new BadRequestException('Error saving the ticket');
    }

    // Emit an event so the NotificationsService can create a notification
    this.eventEmitter.emit('ticket.created', { ticket: newTicket });

    return newTicket;
  }
  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      relations: ['assigned', 'assignee', 'activities', 'activities.addedBy'],
      order: { updatedDate: 'ASC' },
    });
  }

  async findAllAssignedToUser(userId: string): Promise<Ticket[]> {
    return await this.ticketRepository
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.assigned', 'assigned')
      .where('assigned.id = :userId', { userId })
      .orderBy('ticket.updatedDate', 'ASC')
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

  @UseGuards(AuthGuard)
  async remove(id: number): Promise<string> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Ticket con ID "${id}" no encontrado`);
    }
    return `Ticket con ID "${id}" eliminado correctamente`;
  }
}
