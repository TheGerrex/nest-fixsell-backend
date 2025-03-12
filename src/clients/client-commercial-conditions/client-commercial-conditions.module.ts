import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientCommercialConditionsService } from './client-commercial-conditions.service';
import { ClientCommercialConditionsController } from './client-commercial-conditions.controller';
import { ClientCommercialCondition } from './entities/client-commercial-condition.entity';
import { Client } from '../entities/client.entity';
import { User } from '../../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientCommercialCondition, Client, User]),
  ],
  controllers: [ClientCommercialConditionsController],
  providers: [ClientCommercialConditionsService],
  exports: [ClientCommercialConditionsService],
})
export class ClientCommercialConditionsModule {}
