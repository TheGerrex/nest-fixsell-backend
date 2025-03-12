import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientSuspensionConfigsService } from './client-suspension-configs.service';
import { ClientSuspensionConfigsController } from './client-suspension-configs.controller';
import { ClientSuspensionConfig } from './entities/client-suspension-config.entity';
import { Client } from '../entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientSuspensionConfig, Client])],
  controllers: [ClientSuspensionConfigsController],
  providers: [ClientSuspensionConfigsService],
  exports: [ClientSuspensionConfigsService],
})
export class ClientSuspensionConfigsModule {}
