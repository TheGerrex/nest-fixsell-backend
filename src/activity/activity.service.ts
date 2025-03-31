import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Ticket } from 'src/tickets/entities/ticket.entity';
@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activitiesRepository: Repository<Activity>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = new Activity();
    activity.text = createActivityDto.text;
    activity.addedAt = createActivityDto.addedAt;

    // Validate the UUID
    if (!isUUID(createActivityDto.addedBy.id)) {
      throw new BadRequestException(
        `Formato UUID inválido: ${createActivityDto.addedBy}`,
      );
    }

    // Check if ticket is a number
    if (typeof createActivityDto.ticket !== 'number') {
      throw new BadRequestException('Ticket ID must be a number');
    }

    // Check if ticket exists
    const ticket = await this.ticketRepository.findOne({
      where: { id: createActivityDto.ticket },
    });

    if (!ticket) {
      throw new NotFoundException(
        `Ticket no encontrado con el id: ${createActivityDto.ticket}`,
      );
    }
    // Find the user who added the activity
    const user = await this.usersRepository.findOne({
      where: { id: createActivityDto.addedBy.id },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario no encontrado con el id: ${createActivityDto.addedBy}`,
      );
    }

    activity.addedBy = user;
    activity.ticket = ticket;

    // Save the activity
    await this.activitiesRepository.save(activity);

    // Update the ticket's updatedDate with the current date and time
    const currentUtcDate = new Date().toISOString();
    await this.ticketRepository.query(
      `UPDATE ticket SET "updatedDate" = $1 WHERE id = $2`,
      [currentUtcDate, ticket.id],
    );

    console.log(
      `Updated ticket ${ticket.id} updatedDate to ${currentUtcDate} after activity creation`,
    );

    return activity;
  }

  async findAll(): Promise<Activity[]> {
    return this.activitiesRepository.find({ relations: ['addedBy', 'ticket'] });
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['addedBy', 'ticket'], // Include the ticket relation
    });

    if (!activity) {
      throw new NotFoundException(`Actividad no encontrada con el id: ${id}`);
    }

    return activity;
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    // Validate the UUID
    if (!isUUID(updateActivityDto.addedBy.id)) {
      throw new BadRequestException(
        `Formato UUID inválido: ${updateActivityDto.addedBy.id}`,
      );
    }

    // Find the user who added the activity
    const user = await this.usersRepository.findOne({
      where: { id: updateActivityDto.addedBy.id },
    });

    if (!user) {
      throw new NotFoundException(
        `Usuario no encontrado con el id: ${updateActivityDto.addedBy.id}`,
      );
    }

    // Validate the ticket
    if (typeof updateActivityDto.ticket !== 'number') {
      throw new BadRequestException('Ticket ID must be a number');
    }

    // Find the ticket
    const ticket = await this.ticketRepository.findOne({
      where: { id: updateActivityDto.ticket },
    });

    if (!ticket) {
      throw new NotFoundException(
        `Ticket no encontrado con el id: ${updateActivityDto.ticket}`,
      );
    }

    await this.activitiesRepository.update(id, {
      ...updateActivityDto,
      addedBy: user,
      ticket: ticket,
    });

    const updatedActivity = await this.activitiesRepository.findOne({
      where: { id },
      relations: ['addedBy'],
    });

    if (!updatedActivity) {
      throw new NotFoundException(`Actividad no encontrada con el id: ${id}`);
    }

    // Update the ticket's updatedDate with the current date and time
    const currentUtcDate = new Date().toISOString();
    await this.ticketRepository.query(
      `UPDATE ticket SET "updatedDate" = $1 WHERE id = $2`,
      [currentUtcDate, ticket.id],
    );

    // Log the update (optional)
    console.log(
      `Updated ticket ${ticket.id} updatedDate to ${currentUtcDate} after activity update`,
    );

    return updatedActivity;
  }

  async remove(id: number): Promise<void> {
    const result = await this.activitiesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Actividad no encontrada con el id: ${id}`);
    }
  }
}
