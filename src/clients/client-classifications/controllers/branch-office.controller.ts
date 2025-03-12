import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BranchOfficeService } from '../services/branch-office.service';
import { BranchOfficeDto } from '../dto/branch-office.dto';

@Controller('branch-offices')
export class BranchOfficeController {
  constructor(private readonly service: BranchOfficeService) {}

  @Post()
  create(@Body() dto: BranchOfficeDto) {
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
  update(@Param('id') id: string, @Body() dto: BranchOfficeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
