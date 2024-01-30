import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
import { Printer } from '../printers/entities/printer.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packageRepository: Repository<Package>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
  ) {}

  async create(createPackageDto: CreatePackageDto) {
    const printer = await this.printerRepository.findOne({
      where: { id: createPackageDto.printer },
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    const packages = this.packageRepository.create({
      ...createPackageDto,
      printer,
    });

    return this.packageRepository.save(packages);
  }

  async findAll() {
    return await this.packageRepository.find();
  }

  async findOne(id: number) {
    const packages = await this.packageRepository.findOne({ where: { id } });

    if (!packages) {
      throw new Error(`package with ID ${id} not found`);
    }

    return packages;
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const printer = await this.printerRepository.findOne({
      where: { id: updatePackageDto.printer },
      relations: ['package'],
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    if (printer.deal && printer.package.id !== id) {
      throw new Error('Printer already has a package');
    }

    const deal = await this.packageRepository.findOne({ where: { id } });

    if (!deal) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    // Update the deal
    Object.assign(deal, updatePackageDto);

    return await this.packageRepository.save(deal);
  }

  async remove(id: number) {
    const packages = await this.packageRepository.findOne({ where: { id } });

    if (!packages) {
      throw new Error(`packages with ID ${id} not found`);
    }

    // Remove the reference from the printer to the packages
    const printer = await this.printerRepository
      .createQueryBuilder('printer')
      .leftJoinAndSelect('printer.packages', 'packages')
      .where('packages.id = :id', { id })
      .getOne();

    if (printer) {
      printer.package = null;
      await this.printerRepository.save(printer);
    }

    // Now you can delete the packages
    const result = await this.packageRepository.delete({ id });

    return `packages with ID ${id} has been removed` + result;
  }
}
