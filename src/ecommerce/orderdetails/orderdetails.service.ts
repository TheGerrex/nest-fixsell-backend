import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { OrderDetail } from './entities/orderdetail.entity';
import { Order } from '../orders/entities/order.entity';
import { Consumable } from '../consumables/entities/consumable.entity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class OrderdetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Consumable)
    private consumableRepository: Repository<Consumable>,
  ) {}

  async create(createOrderdetailDto: CreateOrderdetailDto) {
    //order data
    const order = await this.orderRepository.findOne({
      where: { id: createOrderdetailDto.orderId },
    });
    if (!order) {
      console.error(new Error('Order not found'));
      throw new NotFoundException('Order not found');
    }

    const orderDetail = this.orderDetailRepository.create(createOrderdetailDto);
    orderDetail.order = order;

    //consumable data
    const consumable = await this.consumableRepository.findOne({
      where: { id: createOrderdetailDto.productId },
    });
    if (!consumable) {
      console.error(new Error('Consumable not found'));
      throw new NotFoundException('Consumable not found');
    }

    orderDetail.consumable = consumable; // assuming you have a consumable property in OrderDetail

    return this.orderDetailRepository.save(orderDetail);
  }

  findAll() {
    return this.orderDetailRepository.find();
  }

  findOne(id: string) {
    return this.orderDetailRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateOrderdetailDto: UpdateOrderdetailDto) {
    await this.orderDetailRepository.update({ id: id }, updateOrderdetailDto);
    return this.orderDetailRepository.findOne({ where: { id: id } });
  }

  remove(id: string) {
    return this.orderDetailRepository.delete(id);
  }
}
