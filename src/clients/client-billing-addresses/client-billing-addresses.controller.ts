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
import { ClientBillingAddressesService } from './client-billing-addresses.service';
import { CreateClientBillingAddressDto } from './dto/create-client-billing-address.dto';
import { UpdateClientBillingAddressDto } from './dto/update-client-billing-address.dto';

@Controller('client-billing-addresses')
export class ClientBillingAddressesController {
  constructor(
    private readonly addressesService: ClientBillingAddressesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAddressDto: CreateClientBillingAddressDto) {
    return this.addressesService.create(createAddressDto);
  }

  @Get()
  findAll(@Query('clientId') clientId?: string) {
    return this.addressesService.findAll(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateClientBillingAddressDto,
  ) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
