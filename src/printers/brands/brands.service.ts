import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from '././entities/brand.entity';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const newBrand = this.brandsRepository.create(createBrandDto);
    await this.brandsRepository.save(newBrand);
    return newBrand;
  }

  findAll(): Promise<Brand[]> {
    return this.brandsRepository.find();
  }

  findOne(id: number): Promise<Brand> {
    return this.brandsRepository.findOne({ where: { id } });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.brandsRepository.preload({
      id,
      ...updateBrandDto,
    });
    if (!brand) {
      throw new Error('Brand not found');
    }
    return this.brandsRepository.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new Error('Brand not found');
    }
    await this.brandsRepository.remove(brand);
  }

  async findByName(name: string): Promise<Brand> {
    return this.brandsRepository.findOne({ where: { name } });
  }
}
