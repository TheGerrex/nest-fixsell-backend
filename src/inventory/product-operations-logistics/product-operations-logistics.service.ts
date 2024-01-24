import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductOperationsLogisticDto } from './dto/create-product-operations-logistic.dto';
import { UpdateProductOperationsLogisticDto } from './dto/update-product-operations-logistic.dto';
import { ProductOperationsLogistic } from './entities/product-operations-logistic.entity';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class ProductOperationsLogisticsService {
  constructor(
    @InjectRepository(ProductOperationsLogistic)
    private productOperationsLogisticRepository: Repository<ProductOperationsLogistic>,
    @InjectRepository(Product) // Inject the Product repository
    private productRepository: Repository<Product>, // Define the productRepository
  ) {}

  async create(
    createProductOperationsLogisticDto: CreateProductOperationsLogisticDto,
  ): Promise<ProductOperationsLogistic> {
    const product = await this.productRepository.findOne({
      where: { id: createProductOperationsLogisticDto.productId },
    });
    if (!product) {
      throw new NotFoundException(
        `Product with id ${createProductOperationsLogisticDto.productId} not found.`,
      );
    }

    const productOperationsLogistic =
      this.productOperationsLogisticRepository.create({
        ...createProductOperationsLogisticDto,
        product: product,
      });

    return this.productOperationsLogisticRepository.save(
      productOperationsLogistic,
    );
  }

  findAll(): Promise<ProductOperationsLogistic[]> {
    return this.productOperationsLogisticRepository.find();
  }

  async findOne(id: number): Promise<ProductOperationsLogistic> {
    const productOperationsLogistic =
      await this.productOperationsLogisticRepository.findOne({
        where: { id: id },
      });
    if (!productOperationsLogistic) {
      throw new NotFoundException(
        `ProductOperationsLogistic with id ${id} not found.`,
      );
    }
    return productOperationsLogistic;
  }

  async update(
    id: number,
    updateProductOperationsLogisticDto: UpdateProductOperationsLogisticDto,
  ): Promise<ProductOperationsLogistic> {
    const productOperationsLogistic =
      await this.productOperationsLogisticRepository.preload({
        id: id,
        ...updateProductOperationsLogisticDto,
      });

    if (!productOperationsLogistic) {
      throw new NotFoundException(
        `ProductOperationsLogistic with id ${id} not found.`,
      );
    }

    return this.productOperationsLogisticRepository.save(
      productOperationsLogistic,
    );
  }

  async remove(id: number): Promise<void> {
    const productOperationsLogistic =
      await this.productOperationsLogisticRepository.findOne({
        where: { id: id },
      });

    if (!productOperationsLogistic) {
      throw new NotFoundException(
        `ProductOperationsLogistic with id ${id} not found.`,
      );
    }

    await this.productOperationsLogisticRepository.remove(
      productOperationsLogistic,
    );
  }
}
