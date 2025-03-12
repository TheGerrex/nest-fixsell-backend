import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CollectionZoneService } from '../services/collection-zone.service';
import { CollectionZoneDto } from '../dto/collection-zone.dto';

@Controller('collection-zones')
export class CollectionZoneController {
  constructor(private readonly service: CollectionZoneService) {}

  @Post()
  create(@Body() dto: CollectionZoneDto) {
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
  update(@Param('id') id: string, @Body() dto: CollectionZoneDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
