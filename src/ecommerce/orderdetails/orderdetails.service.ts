import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderdetailDto } from './dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from './dto/update-orderdetail.dto';
import { OrderDetail } from './entities/orderdetail.entity';

@Injectable()
export class OrderdetailsService {
  constructor(
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
  ) {}

  create(createOrderdetailDto: CreateOrderdetailDto) {
    const orderDetail = this.orderDetailRepository.create(createOrderdetailDto);
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
