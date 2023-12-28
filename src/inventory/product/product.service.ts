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
      throw new InternalServerErrorException(
        error.message || 'Something went wrong.',
      );
    }
  }

  async findAll() {
    try {
      return this.productRepository.find({
        relations: ['product_categories'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error.message || 'Something went wrong.',
      );
    }
  }

  async findOneById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['product_categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return product;
  }

  async findOneByName(name: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { name },
      relations: ['product_categories'],
    });

    if (!product) {
      throw new NotFoundException(`Product with name ${name} not found.`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    let productCategories = [];
    if (
      Array.isArray(updateProductDto.product_categories) &&
      updateProductDto.product_categories.length > 0
    ) {
      productCategories = await this.productCategoryRepository.find({
        where: {
          category_name: In(updateProductDto.product_categories),
        },
      });
      if (
        productCategories.length !== updateProductDto.product_categories.length
      ) {
        throw new NotFoundException(
          `One or more product categories not found.`,
        );
      }
    }

    await this.productRepository.update(id, {
      ...updateProductDto,
      product_categories: productCategories,
    });

    const updatedProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['product_categories'],
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }
  }
}
