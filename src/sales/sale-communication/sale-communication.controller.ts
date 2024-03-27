import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SaleCommunicationService } from './sale-communication.service';
import { CreateSaleCommunicationDto } from './dto/create-sale-communication.dto';
import { UpdateSaleCommunicationDto } from './dto/update-sale-communication.dto';

@Controller('sale-communication')
export class SaleCommunicationController {
  constructor(
    private readonly saleCommunicationService: SaleCommunicationService,
  ) {}

  @Post()
  create(@Body() createSaleCommunicationDto: CreateSaleCommunicationDto) {
    return this.saleCommunicationService.create(createSaleCommunicationDto);
  }

  @Get()
  findAll() {
    return this.saleCommunicationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleCommunicationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSaleCommunicationDto: UpdateSaleCommunicationDto,
  ) {
    return this.saleCommunicationService.update(id, updateSaleCommunicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saleCommunicationService.remove(id);
  }
}
