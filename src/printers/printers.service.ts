import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Printer } from './entities/printer.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class PrintersService {

  constructor(@InjectModel(Printer.name) private printerModel: Model<Printer>) {}

  async create(createPrinterDto: CreatePrinterDto): Promise<Printer> {
    try {
      const newPrinter = new this.printerModel(createPrinterDto);
      return await newPrinter.save();
    } catch (error) {
      if(error.code === 11000) {
        throw new BadRequestException(`${createPrinterDto.model} ya existe.`)
      }
      throw new InternalServerErrorException("Algo salio muy mal.")
    }
  }

  async findAll(): Promise<Printer[]> {
    return await this.printerModel.find().exec()
  }

  async findDealPrinters(): Promise<Printer[]> {
    return this.printerModel.find({ isDeal: true }).exec();
  }

  async findOne(id: string): Promise<Printer> {
    try {
      const objectId = new ObjectId(id);
      const printer = await this.printerModel.findById(objectId).exec();
      if (!printer) {
        throw new NotFoundException('Printer not found');
      }
      return printer;
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new NotFoundException('Invalid printer ID');
      }
      throw error;
    }
  }
  

  async update(id: string, updatePrinterDto: UpdatePrinterDto): Promise<Printer> {
    try {
      const objectId = new ObjectId(id);
      console.log(id);
      console.log(objectId);
      const updatedPrinter = await this.printerModel
        .findByIdAndUpdate(objectId, updatePrinterDto, { new: true })
        .exec();
  
      if (!updatedPrinter) {
        throw new NotFoundException('Printer not found');
      }
  
      return updatedPrinter;
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new NotFoundException('Invalid printer ID');
      }
      throw error;
    }
  }
  

  async remove(id: string) {
    try {
      const objectId = new ObjectId(id);
      const printer = await this.printerModel.deleteOne(objectId);
      if (!printer) {
        throw new NotFoundException('Printer not found');
      }
      return printer;
    } catch (error) {
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new NotFoundException('Invalid printer ID');
      }
      throw error;
    }
  }

  
}
