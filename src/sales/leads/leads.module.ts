import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { Lead } from './entities/lead.entity';
import { User } from 'src/auth/entities/user.entity';
import { SaleCommunication } from '../sale-communication/entities/sale-communication.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, User, SaleCommunication])],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
