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
import { ClientShippingAddressesService } from './client-shipping-addresses.service';
import { CreateClientShippingAddressDto } from './dto/create-client-shipping-address.dto';
import { UpdateClientShippingAddressDto } from './dto/update-client-shipping-address.dto';

@Controller('client-shipping-addresses')
export class ClientShippingAddressesController {
  constructor(
    private readonly addressesService: ClientShippingAddressesService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAddressDto: CreateClientShippingAddressDto) {
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
    @Body() updateAddressDto: UpdateClientShippingAddressDto,
  ) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
