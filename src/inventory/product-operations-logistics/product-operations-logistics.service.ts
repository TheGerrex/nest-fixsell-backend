import { Injectable } from '@nestjs/common';
import { CreateProductOperationsLogisticDto } from './dto/create-product-operations-logistic.dto';
import { UpdateProductOperationsLogisticDto } from './dto/update-product-operations-logistic.dto';

@Injectable()
export class ProductOperationsLogisticsService {
  create(createProductOperationsLogisticDto: CreateProductOperationsLogisticDto) {
    return 'This action adds a new productOperationsLogistic';
  }

  findAll() {
    return `This action returns all productOperationsLogistics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productOperationsLogistic`;
  }

  update(id: number, updateProductOperationsLogisticDto: UpdateProductOperationsLogisticDto) {
    return `This action updates a #${id} productOperationsLogistic`;
  }

  remove(id: number) {
    return `This action removes a #${id} productOperationsLogistic`;
  }
}
