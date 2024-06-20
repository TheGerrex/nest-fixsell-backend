import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Category } from 'src/printers/categories/entities/category.entity';
import { Brand } from 'src/printers/brands/entities/brand.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';
import { Deal } from 'src/deals/entities/deal.entity';

import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as bcrypt from 'bcryptjs';
import { Package } from 'src/packages/entities/package.entity';
import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/roles/entities/role.entity';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Deal) // Add this line to inject the Deal repository
    private readonly dealRepository: Repository<Deal>,
  ) {}

  async seedPrinters() {
    const jsonString = fs.readFileSync('src/seed/fixsell_db.printers.json', 'utf-8');
    const printersData = JSON.parse(jsonString);
    for (const printerData of printersData) {
      const printer = this.printerRepository.create(printerData);
      await this.printerRepository.save(printer);
    }
  }

  async seedConsumables() {
    const jsonString = fs.readFileSync('src/seed/fixsell_db.consumibles.json', 'utf-8');
    const consumiblesData = JSON.parse(jsonString);
    for (const consumibleData of consumiblesData) {
      const consumible = this.consumibleRepository.create(consumibleData);
      await this.consumibleRepository.save(consumible);
    }
  }

  async seedCategories() {
    const jsonStringCategories = fs.readFileSync('src/seed/fixsell_db.printers.categories.json', 'utf-8');
    const categoriesData = JSON.parse(jsonStringCategories);
    for (const categoryData of categoriesData) {
      const category = this.categoryRepository.create(categoryData);
      await this.categoryRepository.save(category);
    }
  }

  async seedBrands() {
    const jsonStringBrands = fs.readFileSync('src/seed/fixsell_db.printers.brands.json', 'utf-8');
    const brandsData = JSON.parse(jsonStringBrands);
    for (const brandData of brandsData) {
      const brand = this.brandRepository.create(brandData);
      await this.brandRepository.save(brand);
    }
  }

  async seedDeals() {
    const jsonStringDeals = fs.readFileSync('src/seed/fixsell_db.deals.json', 'utf-8');
    const dealsData = JSON.parse(jsonStringDeals);
    const dealsToSave = [];
  
    // Load all printers and create a map of printer names to IDs
    const printers = await this.printerRepository.find();
    const printerNameToIdMap = new Map(printers.map(printer => [printer.model, printer.id]));
    
    // Load all printers and create a map of printer names to IDs
    const consumables = await this.consumibleRepository.find();
    const consumableNameToIdMap = new Map(consumables.map(consumible => [consumible.name, consumible.id]));
  
    for (const dealData of dealsData) {
      // Replace printer name with printer ID
      const printerId = printerNameToIdMap.get(dealData.printer);
      const consumibleId = consumableNameToIdMap.get(dealData.consumible);
      if (printerId) {
        dealData.printer = printerId; // Assign the printer ID
        const deal = this.dealRepository.create(dealData);
        dealsToSave.push(deal);
      } else {
        console.error(`Printer not found for name: ${dealData.printer}`);
        // Handle the case where the printer is not found, e.g., skip or log error
      }
      if (consumibleId) {
        dealData.consumible = consumibleId; // Assign the printer ID
        const deal = this.dealRepository.create(dealData);
        dealsToSave.push(deal);
      } else {
        console.error(`Consumable not found for name: ${dealData.consumible}`);
        // Handle the case where the printer is not found, e.g., skip or log error
      }
    }
  
    // Save all deals in a batch outside the loop for efficiency
    if (dealsToSave.length > 0) {
      await this.dealRepository.save(dealsToSave);
    }
  }

  async seedUsers() {
    try {
      const usersData = JSON.parse(fs.readFileSync('src/seed/fixsell_db.users.json', 'utf-8'));
      for (const userData of usersData) {
        const userExists = await this.userRepository.findOne({ where: { name: userData.name } });
        if (!userExists) {
          const hashedPassword = await bcrypt.hash(userData.password, 10);
          const user = this.userRepository.create({ ...userData, password: hashedPassword });
          await this.userRepository.save(user);
        }
      }
    } catch (error) {
      console.error('Error seeding users:', error);
      // Handle the error appropriately (e.g., logging, throwing an error, etc.)
    }
  }

  async seedRoles() {
    const rolesData = JSON.parse(fs.readFileSync('src/seed/fixsell_db.roles.json', 'utf-8'));
    for (const roleData of rolesData) {
      const roleExists = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (!roleExists) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }
  }


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

    // Delete all existing records in the Deal table
    await this.dealRepository.delete({});

    await this.seedRoles(); // Roles should be seeded first if they are needed by users
    await this.seedUsers();
    await this.seedPrinters();
    await this.seedConsumables();
    await this.seedCategories();
    await this.seedBrands();
    await this.seedDeals();
    // Add calls to other seed functions as needed

    return "Seeding completed!"
  }
}
