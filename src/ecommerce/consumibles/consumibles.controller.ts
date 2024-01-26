import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsumiblesService } from './consumibles.service';
import { CreateConsumibleDto } from './dto/create-consumible.dto';
import { UpdateConsumibleDto } from './dto/update-consumible.dto';

@Controller('consumibles')
export class ConsumiblesController {
  constructor(private readonly consumiblesService: ConsumiblesService) {}

  @Post()
  create(@Body() createConsumibleDto: CreateConsumibleDto) {
    return this.consumiblesService.create(createConsumibleDto);
  }

  @Get()
  findAll() {
    return this.consumiblesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consumiblesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsumibleDto: UpdateConsumibleDto,
  ) {
    return this.consumiblesService.update(id, updateConsumibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consumiblesService.remove(id);
  }
}
