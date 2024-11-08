import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    console.log('Received Event data:', createEventDto); // Log the received data
    try {
      console.log('Creating new Event...');
      const newEvent = this.eventsRepository.create(createEventDto);
      let savedEvent = await this.eventsRepository.save(newEvent);

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
        savedEvent = await this.eventsRepository.save(savedEvent);
      }

      return savedEvent;
    } catch (error) {
      console.error('Error while creating event:', error); // Log the error
      if (error.code === '23505') {
        throw new BadRequestException(
          `${createEventDto.title} already exists.`,
        );
      }
      throw new InternalServerErrorException('Something went wrong.');
    }
  }
  findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  findOne(id: string): Promise<Event> {
    return this.eventsRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.eventsRepository.delete(id);
  }
}
