import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClientPrintersService } from './client-printers.service';
import { CreateClientPrinterDto } from './dto/create-client-printer.dto';
import { UpdateClientPrinterDto } from './dto/update-client-printer.dto';

@Controller('client-printers')
export class ClientPrintersController {
  constructor(private readonly clientPrintersService: ClientPrintersService) {}

  @Post()
  create(@Body() createClientPrinterDto: CreateClientPrinterDto) {
    return this.clientPrintersService.create(createClientPrinterDto);
  }

  @Get()
  findAll() {
    return this.clientPrintersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientPrintersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientPrinterDto: UpdateClientPrinterDto,
  ) {
    return this.clientPrintersService.update(id, updateClientPrinterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientPrintersService.remove(id);
  }
}
