import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductCategory } from '../product-categories/entities/product-category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      let productCategories = [];
      if (
        Array.isArray(createProductDto.product_categories) &&
        createProductDto.product_categories.length > 0
      ) {
        productCategories = await this.productCategoryRepository.find({
          where: {
            category_name: In(createProductDto.product_categories),
          },
        });
        if (
          productCategories.length !==
          createProductDto.product_categories.length
        ) {
          throw new NotFoundException(
            `One or more product categories not found.`,
          );
        }
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        product_categories: productCategories,
      });

      return this.productRepository.save(newProduct);
    } catch (error) {
      console.error(error);
      if (error.code === '23505') {
        // 23505 is the error code for a unique constraint violation in PostgreSQL
        throw new BadRequestException(
          `Product with name ${createProductDto.name} already exists.`,
        );
      }
      throw new InternalServerErrorException('Something went wrong.');
    }
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
