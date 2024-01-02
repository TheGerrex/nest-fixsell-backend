import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionService } from './reception.service';
import { ReceptionController } from './reception.controller';
import { Reception } from './entities/reception.entity';
import { Product } from '../product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reception, Product])],
  controllers: [ReceptionController],
  providers: [ReceptionService],
})
export class ReceptionModule {}
