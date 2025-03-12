import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessLineService } from '../services/business-line.service';
import { BusinessLineDto } from '../dto/business-line.dto';

@Controller('business-lines')
export class BusinessLineController {
  constructor(private readonly service: BusinessLineService) {}

  @Post()
  create(@Body() dto: BusinessLineDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: BusinessLineDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
