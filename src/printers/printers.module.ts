import { Module } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entities/printer.entity';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Module({
  controllers: [PrintersController],
  providers: [PrintersService, FileUploadService],
  imports: [TypeOrmModule.forFeature([Printer])],
  exports: [PrintersService],
})
export class PrintersModule {}
