import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './entities/activity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Ticket } from 'src/tickets/entities/ticket.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Activity, User, Ticket])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
