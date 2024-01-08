import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumable } from './entities/consumable.entity';
import { CreateConsumableDto } from './dto/create-consumable.dto';
import { UpdateConsumableDto } from './dto/update-consumable.dto';

@Injectable()
export class ConsumablesService {
  constructor(
    @InjectRepository(Consumable)
    private consumableRepository: Repository<Consumable>,
  ) {}

  async create(createConsumableDto: CreateConsumableDto) {
    const consumable = this.consumableRepository.create(createConsumableDto);
    await this.consumableRepository.save(consumable);
    return consumable;
  }

  findAll() {
    return this.consumableRepository.find();
  }

  findOne(id: string) {
    return this.consumableRepository.findOne({ where: { id } });
  }

  async update(id: string, updateConsumableDto: UpdateConsumableDto) {
    await this.consumableRepository.update({ id: id }, updateConsumableDto);
    return this.consumableRepository.findOne({ where: { id } });
  }

  remove(id: string) {
    return this.consumableRepository.delete(id);
  }
}
