import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/ticket.entity';
import { User } from '../auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { AuthModule } from 'src/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket, User, Activity]),
    AuthModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
