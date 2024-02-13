import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumible } from './entities/consumible.entity';
import { CreateConsumibleDto } from './dto/create-consumible.dto';
import { UpdateConsumibleDto } from './dto/update-consumible.dto';
import { Printer } from 'src/printers/entities/printer.entity';

@Injectable()
export class ConsumiblesService {
  constructor(
    @InjectRepository(Consumible)
    private consumibleRepository: Repository<Consumible>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
  ) {}

  async create(createConsumibleDto: CreateConsumibleDto) {
    const printers = await this.printerRepository.findByIds(
      createConsumibleDto.printersIds,
    );
    const consumible = this.consumibleRepository.create(createConsumibleDto);
    consumible.printers = printers;
    await this.consumibleRepository.save(consumible);
    return consumible;
  }

  findAll() {
    return this.consumibleRepository.find({ relations: ['printers'] });
  }

  findOne(id: string) {
    return this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers'],
    });
  }

  async update(id: string, updateConsumibleDto: UpdateConsumibleDto) {
    await this.consumibleRepository.update({ id: id }, updateConsumibleDto);
    return this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers'],
    });
  }

  remove(id: string) {
    return this.consumibleRepository.delete(id);
  }
}
