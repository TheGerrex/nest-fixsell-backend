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
import { Brackets, Repository } from 'typeorm';

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
      ...filterProps
    } = filtersPrinterDto;

    let query = this.printersRepository
      .createQueryBuilder('printer')
      .leftJoinAndSelect('printer.deal', 'deal');

    Object.keys(filterProps).forEach((key) => {
      console.log(filterProps);
      if (filterProps[key] !== undefined) {
        const value =
          filterProps[key] === 'true'
            ? true
            : filterProps[key] === 'false'
            ? false
            : filterProps[key];
        query = query.andWhere(`printer.${key} = :${key}`, { [key]: value });
      }
    });

    if (brand) {
      query = query.andWhere('LOWER(printer.brand) IN (:...brand)', { brand });
    }

    if (model) {
      query = query.andWhere('LOWER(printer.model) = :model', { model });
    }

    if (category) {
      query = query.andWhere('LOWER(printer.category) IN (:...category)', {
        category,
      });
    }

    if (printSize) {
      query = query.andWhere('LOWER(printer.printSize) IN (:...printSize)', {
        printSize,
      });
    }

    if (tags) {
      query = query.andWhere('LOWER(printer.tags) = :tags', { tags });
    }

    if (powerConsumption) {
      query = query.andWhere(
        'LOWER(printer.powerConsumption) = :powerConsumption',
        { powerConsumption },
      );
    }

    if (dimensions) {
      query = query.andWhere('LOWER(printer.dimensions) = :dimensions', {
        dimensions,
      });
    }

    if (maxPrintSizeSimple) {
      query = query.andWhere(
        'LOWER(printer.maxPrintSizeSimple) = :maxPrintSizeSimple',
        { maxPrintSizeSimple },
      );
    }

    if (maxPrintSize) {
      query = query.andWhere('LOWER(printer.maxPrintSize) = :maxPrintSize', {
        maxPrintSize,
      });
    }

    if (maxPaperWeight) {
      query = query.andWhere(
        'LOWER(printer.maxPaperWeight) = :maxPaperWeight',
        { maxPaperWeight },
      );
    }

    if (paperSizes) {
      query = query.andWhere('LOWER(printer.paperSizes) = :paperSizes', {
        paperSizes,
      });
    }

    if (applicableOS) {
      query = query.andWhere('LOWER(printer.applicableOS) = :applicableOS', {
        applicableOS,
      });
    }

    if (printerFunctions) {
      query = query.andWhere(
        'LOWER(printer.printerFunctions) = :printerFunctions',
        { printerFunctions },
      );
    }

    if (barcode) {
      query = query.andWhere('LOWER(printer.barcode) = :barcode', { barcode });
    }

    if (printVelocity) {
      const velocityConditions = printVelocity.map((velocity) => {
        const [min, max] = velocity.split('-').map(Number);
        if (max) {
          return `CAST(printer.printVelocity AS INTEGER) >= ${min} AND CAST(printer.printVelocity AS INTEGER) <= ${max}`;
        } else {
          return `CAST(printer.printVelocity AS INTEGER) >= ${min}`;
        }
      });
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(velocityConditions.join(' OR '));
        }),
      );
    }

    if (limit) {
      query = query.take(limit);
    }

    query = query.skip(offset);

    return await query.getMany();
  }

  async findOne(term: string): Promise<Printer> {
    let printer: Printer;

    if (isUUID(term)) {
      printer = await this.printersRepository.findOne({
        where: { id: term as any },
      });
    } else {
      printer = await this.printersRepository
        .createQueryBuilder('printer')
        .leftJoinAndSelect('printer.deal', 'deal')
        .where(`UPPER(printer.model) = :model`, {
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
