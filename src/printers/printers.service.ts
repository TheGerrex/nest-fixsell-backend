import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Printer } from './entities/printer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator';
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

  async findAll(paginationDto: PaginationDto): Promise<Printer[]> {
    const { limit, offset = 0 } = paginationDto;
    if (limit) {
      return await this.printersRepository.find({
        take: limit,
        skip: offset,
      });
    } else {
      return await this.printersRepository.find({
        skip: offset,
      });
    }
  }

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
