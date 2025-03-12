import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BusinessGroupService } from '../services/business-group.service';
import { BusinessGroupDto } from '../dto/business-group.dto';

@Controller('business-groups')
export class BusinessGroupController {
  constructor(private readonly service: BusinessGroupService) {}

  @Post()
  create(@Body() dto: BusinessGroupDto) {
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
  update(@Param('id') id: string, @Body() dto: BusinessGroupDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
