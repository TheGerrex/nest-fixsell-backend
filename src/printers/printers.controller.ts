import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PrintersService } from './printers.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { Printer } from './entities/printer.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post()
  create(@Body() createPrinterDto: CreatePrinterDto) {
    console.log('POST /printers - calling create method');
    console.log(createPrinterDto);
    console.log('creating printer...');
    return this.printersService.create(createPrinterDto);
  }

  // @Get('deal')
  // findDealPrinters() {
  //   return this.printersService.findDealPrinters();
  // }

  @Delete()
  removeAll() {
    console.log('DELETE /printers - calling removeAll method');
    return this.printersService.removeAll();
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log('GET /printers - calling findAll method');
    return this.printersService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string): Promise<Printer> {
    console.log('GET /printers/:term - calling findOne method');
    return this.printersService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrinterDto: UpdatePrinterDto) {
    console.log('PATCH /printers/:id - calling update method');
    return this.printersService.update(id, updatePrinterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    console.log('DELETE /printers/:id - calling remove method');
    return this.printersService.remove(id);
  }
}
