import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Printer } from '../printers/entities/printer.entity';
import { Package } from './entities/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Printer])],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
