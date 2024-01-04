import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: string) {
    return this.orderRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update({ id: id }, updateOrderDto);
    return this.orderRepository.findOne({ where: { id: id } });
  }

  remove(id: string) {
    return this.orderRepository.delete({ id: id });
  }
}
