import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ClientContactsService } from './client-contacts.service';
import { CreateClientContactDto } from './dto/create-client-contact.dto';
import { UpdateClientContactDto } from './dto/update-client-contact.dto';

@Controller('client-contacts')
export class ClientContactsController {
  constructor(private readonly clientContactsService: ClientContactsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientContactDto: CreateClientContactDto) {
    return this.clientContactsService.create(createClientContactDto);
  }

  @Get()
  findAll(@Query('clientId') clientId?: string) {
    return this.clientContactsService.findAll(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientContactsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientContactDto: UpdateClientContactDto,
  ) {
    return this.clientContactsService.update(id, updateClientContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientContactsService.remove(id);
  }
}
