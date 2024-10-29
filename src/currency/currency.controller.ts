import { Controller, Get, Post, Body } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('update')
  async updateExchangeRates() {
    await this.currencyService.updateExchangeRates();
    return { message: 'Exchange rates updated successfully' };
  }

  @Post()
  async addCurrency(@Body() createCurrencyDto: CreateCurrencyDto) {
    const currency = await this.currencyService.addCurrency(createCurrencyDto);
    return { message: 'Currency added successfully', currency };
  }

  @Get()
  async getAllCurrencies() {
    const currencies = await this.currencyService.getAllCurrencies();
    return currencies;
  }
}
