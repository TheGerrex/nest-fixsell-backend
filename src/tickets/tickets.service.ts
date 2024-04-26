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
    });

    try {
      await this.ticketRepository.save(newTicket);
    } catch (err) {
      throw new BadRequestException('Error while saving ticket');
    }

    return newTicket;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketRepository.find();
  }

  async findAllAssignedToUser(userId: string): Promise<Ticket[]> {
    return await this.ticketRepository.find({
      where: { assigned: { id: userId } },
    });
  }

  async findOne(id: number): Promise<Ticket> {
    return await this.ticketRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
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

    await this.ticketRepository.update(id, {
      ...updateTicketDto,
      assigned: assignedUser,
      assignee: assigneeUser,
    });

    const updatedTicket = await this.ticketRepository.findOne({
      where: { id: id },
    });

    if (!updatedTicket) {
      throw new BadRequestException('Ticket not found');
    }

    return updatedTicket;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ticketRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`Ticket with ID "${id}" not found`);
    }
  }
}
