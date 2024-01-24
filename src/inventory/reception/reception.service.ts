import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReceptionDto } from './dto/create-reception.dto';
import { UpdateReceptionDto } from './dto/update-reception.dto';
import { Reception } from './entities/reception.entity';
import { Product } from '../product/entities/product.entity';
import { In } from 'typeorm';

@Injectable()
export class ReceptionService {
  constructor(
    @InjectRepository(Reception)
    private receptionRepository: Repository<Reception>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createReceptionDto: CreateReceptionDto): Promise<Reception> {
    const products = await this.productRepository.find({
      where: { id: In(createReceptionDto.products) },
    });
    const reception = this.receptionRepository.create({
      ...createReceptionDto,
      products,
    });
    await this.receptionRepository.save(reception);
    return reception;
  }

  async findAll(): Promise<Reception[]> {
    return await this.receptionRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Reception> {
    const reception = await this.receptionRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!reception) {
      throw new NotFoundException(`Reception #${id} not found`);
    }
    return reception;
  }

  async update(
    id: number,
    updateReceptionDto: UpdateReceptionDto,
  ): Promise<Reception> {
    const products = await this.productRepository.find({
      where: { id: In(updateReceptionDto.products) },
    });
    const updateResult = await this.receptionRepository.update(id, {
      ...updateReceptionDto,
      products,
    });
    if (!updateResult.affected) {
      throw new NotFoundException(`Reception #${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const deleteResult = await this.receptionRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException(`Reception #${id} not found`);
    }
  }
}
