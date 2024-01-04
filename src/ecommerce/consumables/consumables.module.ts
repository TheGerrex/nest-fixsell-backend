import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumable } from './entities/consumable.entity';
import { ConsumablesService } from './consumables.service';
import { ConsumablesController } from './consumables.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consumable])],
  controllers: [ConsumablesController],
  providers: [ConsumablesService],
})
export class ConsumablesModule {}
