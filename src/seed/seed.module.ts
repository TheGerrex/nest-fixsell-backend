import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Printer } from 'src/printers/entities/printer.entity';
import { Category } from 'src/printers/categories/entities/category.entity';
import { Brand } from 'src/printers/brands/entities/brand.entity';
import { Consumible } from 'src/ecommerce/consumibles/entities/consumible.entity';
import { Package } from 'src/packages/entities/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    TypeOrmModule.forFeature([Printer, Category, Consumible, Brand, Package]), // Import TypeOrmModule and specify entities
  ],
})
export class SeedModule {}
