import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetail } from './entities/orderdetail.entity';
import { OrderdetailsService } from './orderdetails.service';
import { OrderdetailsController } from './orderdetails.controller';
import { Order } from '../orders/entities/order.entity';
import { Consumible } from '../consumibles/entities/consumible.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail, Order, Consumible])],
  controllers: [OrderdetailsController],
  providers: [OrderdetailsService],
})
export class OrderdetailsModule {}
