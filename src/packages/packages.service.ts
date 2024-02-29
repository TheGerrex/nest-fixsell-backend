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
    return await this.packageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.printer', 'printer')
      .getMany();
  }

  async findOne(id: number) {
    const packageEntity = await this.packageRepository
      .createQueryBuilder('package')
      .leftJoinAndSelect('package.printer', 'printer')
      .where('package.id = :id', { id })
      .getOne();

    if (!packageEntity) {
      throw new Error(`package with ID ${id} not found`);
    }

    return packageEntity;
  }

  async update(id: number, updatePackageDto: UpdatePackageDto) {
    const printer = await this.printerRepository.findOne({
      where: { id: updatePackageDto.printer },
      relations: ['packages'],
    });

    if (!printer) {
      throw new Error('Printer not found');
    }

    if (printer.packages.some((pkg) => pkg.id === id)) {
      throw new Error('Printer already has a package');
    }

    const packages = await this.packageRepository.findOne({ where: { id } });

    if (!packages) {
      throw new Error(`Deal with ID ${id} not found`);
    }

    // Update the deal
    Object.assign(packages, updatePackageDto);

    return await this.packageRepository.save(packages);
  }

  async remove(id: number) {
    const packageEntity = await this.packageRepository.findOne({
      where: { id },
      relations: ['printer'],
    });

    if (!packageEntity) {
      throw new Error(`Package with ID ${id} not found`);
    }

    // Get the printer that has the package
    const printer = await this.printerRepository.findOne({
      where: { id: packageEntity.printer.id },
      relations: ['packages'],
    });

    if (printer) {
      // Remove the specific package from the printer's packages array
      printer.packages = printer.packages.filter(
        (pkg: Package) => pkg.id !== id,
      );
      await this.printerRepository.save(printer);
    }

    // Now you can delete the package
    await this.packageRepository.remove(packageEntity);

    return `Package with ID ${id} has been successfully removed.`;
  }
}
