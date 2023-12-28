import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(createProductCategoryDto: CreateProductCategoryDto) {
    let parentCategory = null;
    if (createProductCategoryDto.parent_category) {
      parentCategory = await this.productCategoryRepository.findOne({
        where: { id: createProductCategoryDto.parent_category },
      });
      if (!parentCategory) {
        throw new NotFoundException(`Parent category not found`);
      }
    }

    const newProductCategory = this.productCategoryRepository.create({
      ...createProductCategoryDto,
      parent_category: parentCategory,
    });

    return this.productCategoryRepository.save(newProductCategory);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({
      relations: ['products', 'child_categories', 'parent_category'],
    });
  }

  async findOne(id: string): Promise<ProductCategory> {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id: Number(id) },
    });

    if (!productCategory) {
      throw new NotFoundException(`Product category with id ${id} not found.`);
    }

    return productCategory;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const { parent_category, ...updateDto } = updateProductCategoryDto;

    let parentCategory: ProductCategory | undefined;
    if (parent_category) {
      parentCategory = await this.productCategoryRepository.findOne({
        where: { id: parent_category },
      });
      if (!parentCategory) {
        throw new NotFoundException(
          `Parent category with id ${parent_category} not found.`,
        );
      }
    }

    const productCategory = await this.productCategoryRepository.preload({
      id: id,
      parent_category: parentCategory,
      ...updateDto,
    });

    if (!productCategory) {
      throw new NotFoundException(`ProductCategory with id ${id} not found.`);
    }

    return this.productCategoryRepository.save(productCategory);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.productCategoryRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`ProductCategory with id ${id} not found.`);
    }
  }
}
