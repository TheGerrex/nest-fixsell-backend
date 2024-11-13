import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';
import { Deal } from '../deals/entities/deal.entity';
import * as path from 'path';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Deal)
    private dealsRepository: Repository<Deal>,
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    console.log('Received Event data:', createEventDto);
    try {
      // Create event
      const newEvent = this.eventsRepository.create({
        ...createEventDto,
        deals: [],
      });
      let savedEvent = await this.eventsRepository.save(newEvent);

      // Handle image upload
      if (createEventDto.image) {
        const url = new URL(createEventDto.image);
        const oldPath = url.pathname.substring(1);
        const fileName = path.basename(oldPath);
        const decodedFileName = decodeURIComponent(fileName);
        const newPath = `events/images/${encodeURIComponent(
          savedEvent.title.replace(/ /g, '_'),
        )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;

        await this.fileUploadService.renameFile(oldPath, newPath);
        const newUrl = `https://${this.configService.get(
          'AWS_BUCKET_NAME',
        )}.s3.amazonaws.com/${newPath}`;
        savedEvent.image = newUrl;
      }

      // Associate deals if provided
      if (createEventDto.dealIds && createEventDto.dealIds.length > 0) {
        const deals = await this.dealsRepository.findByIds(
          createEventDto.dealIds,
        );
        if (deals.length !== createEventDto.dealIds.length) {
          throw new NotFoundException('One or more deals not found');
        }
        savedEvent.deals = deals;
      }

      // Save final event with all associations
      savedEvent = await this.eventsRepository.save(savedEvent);
      return savedEvent;
    } catch (error) {
      console.error('Error while creating event:', error);
      if (error.code === '23505') {
        throw new BadRequestException(
          `${createEventDto.title} already exists.`,
        );
      }
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['deals'],
    });
  }

  findOne(id: string): Promise<Event> {
    return this.eventsRepository.findOne({
      where: { id },
      relations: ['deals'],
    });
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['deals'],
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    try {
      // Set event reference to null for all associated deals
      if (event.deals && event.deals.length > 0) {
        for (const deal of event.deals) {
          deal.event = null;
          await this.dealsRepository.save(deal);
        }
      }

      // Remove the event
      await this.eventsRepository.remove(event);
    } catch (error) {
      console.error('Error removing event:', error);
      throw new InternalServerErrorException('Failed to remove event');
    }
  }
}
