import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
    private readonly httpService: HttpService,
  ) {}

  async addCurrency(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const { name } = createCurrencyDto;
    const currency = this.currencyRepository.create({ name, exchangeRate: 0 });
    return this.currencyRepository.save(currency);
  }

  async getAllCurrencies(): Promise<Currency[]> {
    return this.currencyRepository.find();
  }

  async updateExchangeRates() {
    const currencies = await this.currencyRepository.find();
    const date = 'latest';
    const apiVersion = 'v1';
    const endpoint = 'currencies';

    try {
      // Fetch exchange rates with USD as the base currency
      const usdResponse = await lastValueFrom(
        this.httpService.get(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/${apiVersion}/${endpoint}/usd.json`,
        ),
      );

      // Fetch exchange rates with MXN as the base currency
      const mxnResponse = await lastValueFrom(
        this.httpService.get(
          `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/${apiVersion}/${endpoint}/mxn.json`,
        ),
      );

      // Log the API responses to verify their structure
      console.log('USD Response:', usdResponse.data);
      console.log('MXN Response:', mxnResponse.data);

      if (usdResponse.data && mxnResponse.data) {
        for (const currency of currencies) {
          let exchangeRate = 0;
          if (currency.name.toLowerCase() === 'usd') {
            exchangeRate = mxnResponse.data.mxn['usd'];
          } else if (currency.name.toLowerCase() === 'mxn') {
            exchangeRate = usdResponse.data.usd['mxn'];
          }

          if (exchangeRate) {
            currency.exchangeRate = exchangeRate;
            currency.lastUpdated = new Date();
            await this.currencyRepository.save(currency);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update exchange rates', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    this.updateExchangeRates();
  }
}
