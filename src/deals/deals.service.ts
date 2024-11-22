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
    let itemType;
    let itemName;

    if (createDealDto.printer && createDealDto.consumible) {
      throw new BadRequestException(
        'Una oferta puede tener una impresora o un consumible, pero no ambos',
      );
    }

    if (createDealDto.printer) {
      printer = await this.printerRepository.findOne({
        where: { id: createDealDto.printer },
        relations: ['deals'],
      });

      if (!printer) {
        throw new NotFoundException('Impresora no encontrada');
      }

      existingDeals = printer.deals;
      itemType = 'printer';
      itemName = printer.model;
    }

    if (createDealDto.consumible) {
      consumible = await this.consumibleRepository.findOne({
        where: { id: createDealDto.consumible },
        relations: ['deals'],
      });

      if (!consumible) {
        throw new NotFoundException('Consumible no encontrado');
      }

      existingDeals = consumible.deals;
      itemType = 'consumible';
      itemName = consumible.model;
    }

    const overlappingDeal = existingDeals.find(
      (deal) =>
        deal.dealStartDate <= createDealDto.dealEndDate &&
        deal.dealEndDate >= createDealDto.dealStartDate,
    );

    if (overlappingDeal) {
      const formattedStartDate = new Date(
        overlappingDeal.dealStartDate,
      ).toLocaleDateString();
      const formattedEndDate = new Date(
        overlappingDeal.dealEndDate,
      ).toLocaleDateString();

      throw new BadRequestException(
        `Ya existe una promoción para ${
          itemType === 'printer' ? 'la impresora' : 'el consumible'
        } "${itemName}" durante estas fechas. ` +
          `Oferta existente: ID ${overlappingDeal.id} del ${formattedStartDate} al ${formattedEndDate}`,
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
      relations: ['printer', 'consumible', 'event'],
    });
  }

  async findOne(id: number) {
    const deal = await this.dealRepository.findOne({
      where: { id },
      relations: ['printer', 'consumible', 'event'],
    });

    if (!deal) {
      throw new Error(`Promocion con ID ${id} no encontrada`);
    }

    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto) {
    let printer;
    let consumible;
    let existingDeals = [];

    if (updateDealDto.printer && updateDealDto.consumible) {
      throw new Error(
        'Una promocion puede tener una impresora o un consumible, pero no ambos',
      );
    }

    if (updateDealDto.printer) {
      printer = await this.printerRepository.findOne({
        where: { id: updateDealDto.printer },
        relations: ['deals'],
      });

      if (!printer) {
        throw new Error('Impresora no encontrada');
      }

      existingDeals = printer.deals || [];
    }

    if (updateDealDto.consumible) {
      consumible = await this.consumibleRepository.findOne({
        where: { id: updateDealDto.consumible },
        relations: ['deals'],
      });

      if (!consumible) {
        throw new Error('Consumible no encontrado');
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
      throw new BadRequestException('Ya existe otra promoción previa/futura.');
    }

    const deal = await this.dealRepository.findOne({ where: { id } });

    if (!deal) {
      throw new NotFoundException(`Promocion con ID ${id} no encontrada`);
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
      throw new NotFoundException(`Promocion con ID ${id} no encontrada`);
    }

    console.log('Deal to remove:', deal); // Log the deal object

    try {
      // Remove from event if exists
      if (deal.event) {
        console.log('Associated Event:', deal.event);
        console.log('Event deals before filtering:', deal.event.deals);
        deal.event.deals = deal.event.deals?.filter((d) => d.id !== id) || [];
        console.log('Event deals after filtering:', deal.event.deals);
        await this.eventRepository.save(deal.event);
      }

      // Remove from printer if exists
      if (deal.printer) {
        console.log('Associated Printer:', deal.printer);
        console.log('Printer deals before filtering:', deal.printer.deals);
        deal.printer.deals =
          deal.printer.deals?.filter((d) => d.id !== id) || [];
        console.log('Printer deals after filtering:', deal.printer.deals);
        await this.printerRepository.save(deal.printer);
      }

      // Remove from consumible if exists
      if (deal.consumible) {
        console.log('Associated Consumible:', deal.consumible);
        console.log(
          'Consumible deals before filtering:',
          deal.consumible.deals,
        );
        deal.consumible.deals =
          deal.consumible.deals?.filter((d) => d.id !== id) || [];
        console.log('Consumible deals after filtering:', deal.consumible.deals);
        await this.consumibleRepository.save(deal.consumible);
      }

      // Delete the deal
      await this.dealRepository.remove(deal);
      return `Oferta con ID ${id} ha sido eliminada exitosamente`;
    } catch (error) {
      console.error('Error al eliminar oferta:', error);
      throw new InternalServerErrorException('Error al eliminar la oferta');
    }
  }
}
