import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { Deal } from './entities/deal.entity';
import { Printer } from '../printers/entities/printer.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deal)
    private dealRepository: Repository<Deal>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    @InjectRepository(Consumible)
    private consumibleRepository: Repository<Consumible>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createDealDto: CreateDealDto) {
    let printer;
    let consumible;
    let existingDeals;

    if (createDealDto.printer && createDealDto.consumible) {
      throw new Error(
        'A deal can have either a printer or a consumible but not both',
      );
    }

    if (createDealDto.printer) {
      printer = await this.printerRepository.findOne({
        where: { id: createDealDto.printer },
        relations: ['deals'],
      });

      if (!printer) {
        throw new Error('Printer not found');
      }

      existingDeals = printer.deals;
    }

    if (createDealDto.consumible) {
      consumible = await this.consumibleRepository.findOne({
        where: { id: createDealDto.consumible },
        relations: ['deals'],
      });

      if (!consumible) {
        throw new Error('Consumible not found');
      }

      existingDeals = consumible.deals;
    }

    const overlappingDeal = existingDeals.find(
      (deal) =>
        deal.dealStartDate <= createDealDto.dealEndDate &&
        deal.dealEndDate >= createDealDto.dealStartDate,
    );

    if (overlappingDeal) {
      throw new BadRequestException(
        'Another promotion within those dates already exists.',
      );
    }

    const deal = this.dealRepository.create({
      ...createDealDto,
      printer,
      consumible,
    });

    return this.dealRepository.save(deal);
  }

  async findAll() {
    return await this.dealRepository.find({
      relations: ['printer', 'consumible'],
    });
  }

  async findOne(id: number) {
    const deal = await this.dealRepository.findOne({
      where: { id },
      relations: ['printer', 'consumible'],
    });

    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto) {
    let printer;
    let consumible;
    let existingDeals = [];

    if (updateDealDto.printer && updateDealDto.consumible) {
      throw new Error(
        'A deal can have either a printer or a consumible but not both',
      );
    }

    if (updateDealDto.printer) {
      printer = await this.printerRepository.findOne({
        where: { id: updateDealDto.printer },
        relations: ['deals'],
      });

      if (!printer) {
        throw new Error('Printer not found');
      }

      existingDeals = printer.deals || [];
    }

    if (updateDealDto.consumible) {
      consumible = await this.consumibleRepository.findOne({
        where: { id: updateDealDto.consumible },
        relations: ['deals'],
      });

      if (!consumible) {
        throw new Error('Consumible not found');
      }

      existingDeals = consumible.deals || [];
    }

    const overlappingDeal = existingDeals.find(
      (deal) =>
        deal.id !== id &&
        deal.dealStartDate <= updateDealDto.dealEndDate &&
        deal.dealEndDate >= updateDealDto.dealStartDate,
    );

    if (overlappingDeal) {
      throw new BadRequestException(
        'Another previous/future promotion already exists.',
      );
    }

    const deal = await this.dealRepository.findOne({ where: { id } });

    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    // Update the deal
    Object.assign(deal, updateDealDto, { printer, consumible });

    return await this.dealRepository.save(deal);
  }
  async remove(id: number): Promise<string> {
    const deal = await this.dealRepository.findOne({
      where: { id },
      relations: ['event', 'printer', 'consumible'],
    });

    if (!deal) {
      throw new NotFoundException(`Deal with ID ${id} not found`);
    }

    try {
      // Remove from event if exists
      if (deal.event) {
        deal.event.deals = deal.event.deals.filter((d) => d.id !== id);
        await this.eventRepository.save(deal.event);
      }

      // Remove from printer if exists
      if (deal.printer) {
        deal.printer.deals = deal.printer.deals.filter((d) => d.id !== id);
        await this.printerRepository.save(deal.printer);
      }

      // Remove from consumible if exists
      if (deal.consumible) {
        deal.consumible.deals = deal.consumible.deals.filter(
          (d) => d.id !== id,
        );
        await this.consumibleRepository.save(deal.consumible);
      }

      // Delete the deal
      await this.dealRepository.remove(deal);

      return `Deal with ID ${id} has been successfully removed`;
    } catch (error) {
      console.error('Error removing deal:', error);
      throw new InternalServerErrorException('Failed to remove deal');
    }
  }
}
