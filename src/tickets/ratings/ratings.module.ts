import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { Rating } from './entities/rating.entity';
import { Ticket } from '../entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rating, Ticket])],
  controllers: [RatingsController],
  providers: [RatingsService],
  exports: [RatingsService], // Export service to be used in other modules
})
export class RatingsModule {}
