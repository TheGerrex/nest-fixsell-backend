import { Module } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entities/printer.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { BrandsController } from './brands/brands.controller';
import { BrandsService } from './brands/brands.service';
import { BrandsModule } from './brands/brands.module';

@Module({
  controllers: [PrintersController, BrandsController],
  providers: [PrintersService, FileUploadService, BrandsService],
  imports: [TypeOrmModule.forFeature([Printer]), BrandsModule],
  exports: [PrintersService, TypeOrmModule],
})
export class PrintersModule {}
