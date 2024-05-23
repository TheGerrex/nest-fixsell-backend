import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Category } from 'src/printers/categories/entities/category.entity';
import { Brand } from 'src/printers/brands/entities/brand.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';

import { Repository } from 'typeorm';
import * as fs from 'fs';
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

async executeUserSeed() {
  // Delete all existing records in the User table
  await this.userRepository.delete({});

  // ---------------------------USERS---------------------------

  // Read data from the JSON file and parse it to an array of objects for users
  // const jsonStringUsers = fs.readFileSync(
  //   'src/seed/fixsell_db.users.json',
  //   'utf-8',
  // );
  // const usersData: User[] = JSON.parse(jsonStringUsers);

  // // Fetch roles from the database
  // const userRole = await this.roleRepository.findOne({ where: { name: 'user' } });
  // const vendorRole = await this.roleRepository.findOne({ where: { name: 'vendor' } });
  // const adminRole = await this.roleRepository.findOne({ where: { name: 'admin' } });

  // // Loop through the data and create UserEntity instances
  // for (const userData of usersData) {
  //   const user = this.userRepository.create(userData);

  //   // Assign roles to the user
  //   user.roles = [userRole, vendorRole, adminRole];

  //   await this.userRepository.save(user);
  // }

  // return 'User seed executed.';
}

  async executeRoleSeed() {
  
    // Delete all existing records in the Role table
    await this.roleRepository.delete({});
  
    // ---------------------------ROLES---------------------------
  
    // Read data from the JSON file and parse it to an array of objects for roles
    const jsonStringRoles = fs.readFileSync(
      'src/seed/fixsell_db.roles.json',
      'utf-8',
    );
    const rolesData = JSON.parse(jsonStringRoles);
  
    // Create a map to store the created roles
    const roles = new Map();
  
    // Loop through the data and create RoleEntity instances
    for (const roleData of rolesData) {
      const role = this.roleRepository.create(roleData);
      await this.roleRepository.save(role);
  
      // Store the created role in the map
      roles.set(roleData.name, role);
    }
  
    return 'Role seed executed.';
  }
}
