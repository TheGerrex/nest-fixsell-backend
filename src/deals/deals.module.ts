import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealsService } from './deals.service';
import { DealsController } from './deals.controller';
import { Deal } from './entities/deal.entity';
import { Printer } from '../printers/entities/printer.entity';
import { Consumible } from '../ecommerce/consumibles/entities/consumible.entity';
import { Event } from '../events/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deal, Printer, Consumible, Event])],
  controllers: [DealsController],
  providers: [DealsService],
})
export class DealsModule {}
