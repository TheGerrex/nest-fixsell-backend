import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    // Check if ticket exists
    const ticket = await this.ticketsRepository.findOneBy({
      id: createRatingDto.ticketId,
    });

    if (!ticket) {
      throw new NotFoundException(
        `Ticket with ID ${createRatingDto.ticketId} not found`,
      );
    }

    const rating = this.ratingsRepository.create(createRatingDto);
    return this.ratingsRepository.save(rating);
  }

  async findAll(): Promise<Rating[]> {
    return this.ratingsRepository.find({
      relations: ['ticket'],
    });
  }

  async findOne(id: number): Promise<Rating> {
    const rating = await this.ratingsRepository.findOne({
      where: { id },
      relations: ['ticket'],
    });

    if (!rating) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }

    return rating;
  }

  async findByTicketId(ticketId: number): Promise<Rating[]> {
    return this.ratingsRepository.find({
      where: { ticketId },
    });
  }

  async update(id: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.findOne(id);

    // Update rating properties
    Object.assign(rating, updateRatingDto);

    return this.ratingsRepository.save(rating);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ratingsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Rating with ID ${id} not found`);
    }
  }
}
