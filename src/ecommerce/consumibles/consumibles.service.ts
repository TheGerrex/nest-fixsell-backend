import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumible } from './entities/consumible.entity';
import { CreateConsumibleDto } from './dto/create-consumible.dto';
import { UpdateConsumibleDto } from './dto/update-consumible.dto';

@Injectable()
export class ConsumiblesService {
  constructor(
    @InjectRepository(Consumible)
    private consumibleRepository: Repository<Consumible>,
  ) {}

  async create(createConsumibleDto: CreateConsumibleDto) {
    const consumible = this.consumibleRepository.create(createConsumibleDto);
    await this.consumibleRepository.save(consumible);
    return consumible;
  }

  findAll() {
    return this.consumibleRepository.find();
  }

  findOne(id: string) {
    return this.consumibleRepository.findOne({ where: { id } });
  }

  async update(id: string, updateConsumibleDto: UpdateConsumibleDto) {
    await this.consumibleRepository.update({ id: id }, updateConsumibleDto);
    return this.consumibleRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.consumibleRepository.delete(id);
  }
}
