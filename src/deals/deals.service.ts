import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { Deal } from './entities/deal.entity';
import { Printer } from '../printers/entities/printer.entity';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
  ) {}

  async create(createDealDto: CreateDealDto) {
    const printer = await this.printerRepository.findOne({
      where: { id: createDealDto.printer },
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    const deal = this.dealRepository.create({
      ...createDealDto,
      printer,
    });

    return this.dealRepository.save(deal);
  }

  async findAll() {
    return await this.dealRepository.find();
  }

  async findOne(id: number) {
    const deal = await this.dealRepository.findOne({ where: { id } });

    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto) {
    const printer = await this.printerRepository.findOne({
      where: { id: updateDealDto.printer },
      relations: ['deal'],
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    if (printer.deal && printer.deal.id !== id) {
      throw new Error('Printer already has a deal');
    }

    const deal = await this.dealRepository.findOne({ where: { id } });

    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    // Update the deal
    Object.assign(deal, updateDealDto);

    return await this.dealRepository.save(deal);
  }

  async remove(id: number) {
    const deal = await this.dealRepository.findOne({ where: { id } });

    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    // Remove the reference from the printer to the deal
    const printer = await this.printerRepository
      .createQueryBuilder('printer')
      .leftJoinAndSelect('printer.deal', 'deal')
      .where('deal.id = :id', { id })
      .getOne();

    if (printer) {
      printer.deal = null;
      await this.printerRepository.save(printer);
    }

    // Now you can delete the deal
    const result = await this.dealRepository.delete({ id });

    return `Deal with ID ${id} has been removed` + result;
  }
}
