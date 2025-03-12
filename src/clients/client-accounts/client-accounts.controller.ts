import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ClientAccountsService } from './client-accounts.service';
import { CreateClientAccountDto } from './dto/create-client-account.dto';
import { UpdateClientAccountDto } from './dto/update-client-account.dto';

@Controller('client-accounts')
export class ClientAccountsController {
  constructor(private readonly clientAccountsService: ClientAccountsService) {}

  @Post()
  create(@Body() createClientAccountDto: CreateClientAccountDto) {
    return this.clientAccountsService.create(createClientAccountDto);
  }

  @Get()
  findAll(@Query('clientId') clientId?: string) {
    return this.clientAccountsService.findAll(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientAccountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClientAccountDto: UpdateClientAccountDto,
  ) {
    return this.clientAccountsService.update(id, updateClientAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientAccountsService.remove(id);
  }
}
