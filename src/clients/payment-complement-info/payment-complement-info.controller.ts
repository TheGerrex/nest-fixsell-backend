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
import { PaymentComplementInfoService } from './payment-complement-info.service';
import { CreatePaymentComplementInfoDto } from './dto/create-payment-complement-info.dto';
import { UpdatePaymentComplementInfoDto } from './dto/update-payment-complement-info.dto';

@Controller('payment-complement-info')
export class PaymentComplementInfoController {
  constructor(private readonly infoService: PaymentComplementInfoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreatePaymentComplementInfoDto) {
    return this.infoService.create(createDto);
  }

  @Get()
  findAll(@Query('clientAccountId') clientAccountId?: string) {
    return this.infoService.findAll(clientAccountId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdatePaymentComplementInfoDto,
  ) {
    return this.infoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infoService.remove(id);
  }
}
