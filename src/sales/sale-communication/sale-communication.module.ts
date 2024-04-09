import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleCommunicationService } from './sale-communication.service';
import { SaleCommunicationController } from './sale-communication.controller';
import { SaleCommunication } from './entities/sale-communication.entity';
import { Lead } from '../leads/entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaleCommunication, Lead])],
  controllers: [SaleCommunicationController],
  providers: [SaleCommunicationService],
})
export class SaleCommunicationModule {}
