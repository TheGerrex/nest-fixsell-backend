import { Module } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Printer, PrinterSchema } from './entities/printer.entity';

@Module({
  controllers: [PrintersController],
  providers: [PrintersService],
  imports: [MongooseModule.forFeature([{ name: Printer.name, schema: PrinterSchema }])]
})
export class PrintersModule {}
