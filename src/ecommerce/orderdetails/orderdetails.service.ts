import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { OrderDetail } from './entities/orderdetail.entity';
import { Order } from '../orders/entities/order.entity';
import { Consumible } from '../consumibles/entities/consumible.entity';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class OrderdetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Consumible)
    private consumibleRepository: Repository<Consumible>,
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

    //consumible data
    const consumible = await this.consumibleRepository.findOne({
      where: { id: createOrderdetailDto.productId },
    });
    if (!consumible) {
      console.error(new Error('Consumible not found'));
      throw new NotFoundException('Consumible not found');
    }
    orderDetail.consumible = consumible; // assuming you have a consumible property in OrderDetail

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
