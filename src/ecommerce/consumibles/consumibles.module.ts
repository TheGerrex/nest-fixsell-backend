import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consumible } from './entities/consumible.entity';
import { ConsumiblesService } from './consumibles.service';
import { ConsumiblesController } from './consumibles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Consumible])],
  controllers: [ConsumiblesController],
  providers: [ConsumiblesService],
})
export class ConsumiblesModule {}
