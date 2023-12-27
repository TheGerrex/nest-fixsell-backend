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

  findAll() {
    return `This action returns all productCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productCategory`;
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return `This action updates a #${id} productCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} productCategory`;
  }
}
