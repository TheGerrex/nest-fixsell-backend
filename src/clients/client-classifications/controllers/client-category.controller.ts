import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientCategoryService } from '../services/client-category.service';
import { ClientCategoryDto } from '../dto/client-category.dto';

@Controller('client-categories')
export class ClientCategoryController {
  constructor(private readonly service: ClientCategoryService) {}

  @Post()
  create(@Body() dto: ClientCategoryDto) {
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
  update(@Param('id') id: string, @Body() dto: ClientCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
