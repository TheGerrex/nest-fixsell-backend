import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileUploadService } from '../file-upload/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), FileUploadModule],
  controllers: [EventsController],
  providers: [EventsService, FileUploadService],
})
export class EventsModule {}
