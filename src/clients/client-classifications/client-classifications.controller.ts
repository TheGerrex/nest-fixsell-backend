import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClientClassificationsService } from './client-classifications.service';
import { CreateClientClassificationDto } from './dto/create-client-classification.dto';
import { UpdateClientClassificationDto } from './dto/update-client-classification.dto';

@Controller('client-classifications')
export class ClientClassificationsController {
  constructor(
    private readonly clientClassificationsService: ClientClassificationsService,
  ) {}

  @Post()
  create(@Body() dto: CreateClientClassificationDto) {
    return this.clientClassificationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.clientClassificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientClassificationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientClassificationDto) {
    return this.clientClassificationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientClassificationsService.remove(id);
  }
}
