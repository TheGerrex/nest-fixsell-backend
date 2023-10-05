import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PrintersService } from './printers.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Printer } from './entities/printer.entity';

@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post()
  create(@Body() createPrinterDto: CreatePrinterDto) {
    console.log(createPrinterDto);
    return this.printersService.create(createPrinterDto);
  }

  @Get()
  findAll() {
    // return from(this.printersService.findAll());
    return this.printersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Printer> {
    return this.printersService.findOne(id);
  }

  @Get('deal')
  findDealPrinters(): Promise<Printer[]> {
    return this.printersService.findDealPrinters();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrinterDto: UpdatePrinterDto) {
    return this.printersService.update(id, updatePrinterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.printersService.remove(id);
  }
}
