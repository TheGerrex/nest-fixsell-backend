import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Category } from 'src/printers/categories/entities/category.entity';
import { Brand } from 'src/printers/brands/entities/brand.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';

import { Repository } from 'typeorm';
import * as fs from 'fs';
import { Package } from 'src/packages/entities/package.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Printer)
    private readonly printerRepository: Repository<Printer>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Consumible)
    private readonly consumibleRepository: Repository<Consumible>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async executeSeed() {
    // Load all printers
    const printers = await this.printerRepository.find({
      relations: ['consumibles'],
    });
  
    // For each printer
    for (const printer of printers) {
    // Find the packages that reference this printer
    const packages = await this.packageRepository.find({ where: { printer: { id: printer.id } } });

    // Delete each package
    for (const pack of packages) {
      await this.packageRepository.delete(pack.id);
    }

    // Now you can safely remove the printer
    await this.printerRepository.remove(printer);
    }
  
    // Delete all existing records in the Category table
    await this.categoryRepository.delete({});
  
    // Delete all existing records in the Brand table
    await this.brandRepository.delete({});
  
    // Delete all existing records in the Consumible table
    await this.consumibleRepository.delete({});

    // Read data from the JSON file and parse it to an array of objects to printers
    const jsonString = fs.readFileSync(
      'src/seed/fixsell_db.printers.json',
      'utf-8',
    );
    const printersData = JSON.parse(jsonString);

    // Read data from the JSON file and parse it to an array of objects to categories
    const jsonStringCategories = fs.readFileSync(
      'src/seed/fixsell_db.printers.categories.json',
      'utf-8',
    );
    const categoriesData = JSON.parse(jsonStringCategories);

    // Read data from the JSON file and parse it to an array of objects to brands
    const jsonStringBrands = fs.readFileSync(
      'src/seed/fixsell_db.printers.brands.json',
      'utf-8',
    );
    const brandsData = JSON.parse(jsonStringBrands);
    
    // Read data from the JSON file and parse it to an array of objects for consumibles
    const jsonStringConsumibles = fs.readFileSync(
      'src/seed/fixsell_db.consumibles.json',
      'utf-8',
    );
    const consumiblesData = JSON.parse(jsonStringConsumibles);
    
    // Loop through the data and create ConsumibleEntity instances
    for (const consumibleData of consumiblesData) {
      const consumible = this.consumibleRepository.create(consumibleData);
      await this.consumibleRepository.save(consumible);
    }

    // Loop through the data and create PrinterEntity instances
    for (const printerData of printersData) {
      const printer = this.printerRepository.create(printerData);
      await this.printerRepository.save(printer);
    }

    // Loop through the data and create CategoryEntity instances
    for (const categoryData of categoriesData) {
      const category = this.categoryRepository.create(categoryData);
      await this.categoryRepository.save(category);
    }

    // Loop through the data and create BrandEntity instances
    for (const brandData of brandsData) {
      const brand = this.brandRepository.create(brandData);
      await this.brandRepository.save(brand);
    }

    return 'Seed executed.';
  }
}
