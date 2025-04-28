import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from '../auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RatingsModule } from './ratings/ratings.module';
import { Rating } from './ratings/entities/rating.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Activity, Rating]),
    AuthModule,
    EventEmitterModule.forRoot(),
    RatingsModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
