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
@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private printersRepository: Repository<Printer>,
  ) {}

  async create(createPrinterDto: CreatePrinterDto): Promise<Printer> {
    try {
      const newPrinter = this.printersRepository.create(createPrinterDto);
      return await this.printersRepository.save(newPrinter);
    } catch (error) {
      console.error(error); // Log the error details to the console
      if (error.code === '23505') {
        throw new BadRequestException(`${createPrinterDto.model} ya existe.`);
      }
      throw new InternalServerErrorException('Algo salio muy mal.');
    }
  }

  async findAll(): Promise<Printer[]> {
    return await this.printersRepository.find();
  }

  // async findDealPrinters(): Promise<Printer[]> {
  //   return this.printerModel.find({ isDeal: true }).exec();
  // }

  async findOne(id: string): Promise<Printer> {
    const printer = await this.printersRepository.findOne({ where: { id } });
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
    return "Deleted all Printers"
  }
}
