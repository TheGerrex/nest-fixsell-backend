import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterPrinterDto } from './dto/filter-printer.dto';
import { Printer } from './entities/printer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private printersRepository: Repository<Printer>,
  ) {}

  async create(createPrinterDto: CreatePrinterDto): Promise<Printer> {
    try {
      const newPrinter = this.printersRepository.create(createPrinterDto);
      const savedPrinter = await this.printersRepository.save(newPrinter);
      console.log('Created printer:', savedPrinter);
      return savedPrinter;
    } catch (error) {
      console.error('Error while creating printer:', error);
      if (error.code === '23505') {
        throw new BadRequestException(`${createPrinterDto.model} ya existe.`);
      }
      throw new InternalServerErrorException('Algo salio muy mal.');
    }
  }

  async findAll(filtersPrinterDto: FilterPrinterDto = {}): Promise<Printer[]> {
    const { 
      limit, 
      offset = 0, 
      printVelocity, 
      brand, 
      model,
      category,
      tags,
      powerConsumption,
      dimensions,
      maxPrintSizeSimple,
      maxPrintSize,
      printSize,
      maxPaperWeight,
      paperSizes,
      applicableOS,
      printerFunctions,
      barcode, 
      ...filterProps } = filtersPrinterDto;
    
    let query = this.printersRepository.createQueryBuilder('printer');
  
    Object.keys(filterProps).forEach((key) => {
      console.log(filterProps);
      if (filterProps[key] !== undefined) {
        const value = filterProps[key] === 'true' ? true : filterProps[key] === 'false' ? false : filterProps[key];
        query = query.andWhere(`printer.${key} = :${key}`, { [key]: value });
      }
    });

    if (brand) {
      query = query.andWhere('LOWER(printer.brand) = :brand', { brand });
    }
    
    if (model) {
      query = query.andWhere('LOWER(printer.model) = :model', { model });
    }
    
    if (category) {
      query = query.andWhere('LOWER(printer.category) = :category', { category });
    }
    
    if (tags) {
      query = query.andWhere('LOWER(printer.tags) = :tags', { tags });
    }
    
    if (powerConsumption) {
      query = query.andWhere('LOWER(printer.powerConsumption) = :powerConsumption', { powerConsumption });
    }
    
    if (dimensions) {
      query = query.andWhere('LOWER(printer.dimensions) = :dimensions', { dimensions });
    }
    
    if (maxPrintSizeSimple) {
      query = query.andWhere('LOWER(printer.maxPrintSizeSimple) = :maxPrintSizeSimple', { maxPrintSizeSimple });
    }
    
    if (maxPrintSize) {
      query = query.andWhere('LOWER(printer.maxPrintSize) = :maxPrintSize', { maxPrintSize });
    }
    
    if (printSize) {
      query = query.andWhere('LOWER(printer.printSize) = :printSize', { printSize });
    }
    
    if (maxPaperWeight) {
      query = query.andWhere('LOWER(printer.maxPaperWeight) = :maxPaperWeight', { maxPaperWeight });
    }
    
    if (paperSizes) {
      query = query.andWhere('LOWER(printer.paperSizes) = :paperSizes', { paperSizes });
    }
    
    if (applicableOS) {
      query = query.andWhere('LOWER(printer.applicableOS) = :applicableOS', { applicableOS });
    }
    
    if (printerFunctions) {
      query = query.andWhere('LOWER(printer.printerFunctions) = :printerFunctions', { printerFunctions });
    }
    
    if (barcode) {
      query = query.andWhere('LOWER(printer.barcode) = :barcode', { barcode });
    }

    if (printVelocity) {
      switch (printVelocity) {
        case '24-30':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min AND CAST(printer.printVelocity AS INTEGER) <= :max', { min: 24, max: 30 });
          break;
        case '30-40':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min AND CAST(printer.printVelocity AS INTEGER) <= :max', { min: 30, max: 40 });
          break;
        case '40-50':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min AND CAST(printer.printVelocity AS INTEGER) <= :max', { min: 40, max: 50 });
          break;
        case '50-60':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min AND CAST(printer.printVelocity AS INTEGER) <= :max', { min: 50, max: 60 });
          break;
        case '60-80':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min AND CAST(printer.printVelocity AS INTEGER) <= :max', { min: 60, max: 80 });
          break;
        case '80-100':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min AND CAST(printer.printVelocity AS INTEGER) <= :max', { min: 80, max: 100 });
          break;
        case '100+':
          query = query.andWhere('CAST(printer.printVelocity AS INTEGER) >= :min', { min: 100 });
          break;
      }
    }
  
    if (limit) {
      query = query.take(limit);
    }
  
    query = query.skip(offset);
    
    return await query.getMany();
  }

  // async findAll(paginationDto: PaginationDto, searchDto: FindConditions<Printer>): Promise<Printer[]> {
  //   const { limit, offset = 0 } = paginationDto;
  //   if (limit) {
  //     return await this.printersRepository.find({
  //       where: searchDto,
  //       take: limit,
  //       skip: offset,
  //     });
  //   } else {
  //     return await this.printersRepository.find({
  //       where: searchDto,
  //       skip: offset,
  //     });
  //   }
  // }

  // async findDealPrinters(): Promise<Printer[]> {
  //   return this.printerModel.find({ isDeal: true }).exec();
  // }

  async findOne(term: string): Promise<Printer> {
    let printer: Printer;

    if (isUUID(term)) {
      printer = await this.printersRepository.findOne({
        where: { id: term as any },
      });
    } else {
      const queryBuilder = this.printersRepository.createQueryBuilder();
      printer = await queryBuilder
        .where(`UPPER(model) = :model`, {
          model: term.toUpperCase(),
        })
        .getOne();
    }

    if (!printer) {
      throw new NotFoundException('Printer not found');
    }

    return printer;
  }

  async update(
    id: string,
    updatePrinterDto: UpdatePrinterDto,
  ): Promise<Printer> {
    const updateResult = await this.printersRepository.update(
      id,
      updatePrinterDto,
    );
    if (!updateResult.affected) {
      throw new NotFoundException('Printer not found');
    }
    const updatedPrinter = await this.printersRepository.findOne({
      where: { id },
    });
    if (!updatedPrinter) {
      throw new NotFoundException('Printer not found');
    }
    return updatedPrinter;
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.printersRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException('Printer not found');
    }
  }

  async removeAll(): Promise<string> {
    const deleteResult = await this.printersRepository.delete({});
    if (!deleteResult.affected) {
      throw new NotFoundException('Printers not found');
    }
    return 'Deleted all Printers';
  }
}
