import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { lastValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

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
    const url =
      'https://www.banxico.org.mx/SieInternet/consultarDirectorioInternetAction.do?sector=6&accion=consultarCuadro&idCuadro=CF102&locale=es';

    try {
      const response = await lastValueFrom(this.httpService.get(url));
      const html = response.data;
      const $ = cheerio.load(html);

      // Select the <td> with the specific classes and extract the text
      const exchangeRateText = $('td.cd_tabla_renglon.tdObservacion.paddingr')
        .first()
        .text()
        .trim();
      const usdExchangeRate = parseFloat(exchangeRateText.replace(',', '.'));

      if (!isNaN(usdExchangeRate)) {
        let mxnCurrency: Currency | undefined;

        for (const currency of currencies) {
          if (currency.name.toLowerCase() === 'usd') {
            currency.exchangeRate = usdExchangeRate;
            currency.lastUpdated = new Date();
            await this.currencyRepository.save(currency);
          } else if (currency.name.toLowerCase() === 'mxn') {
            mxnCurrency = currency;
          }
        }

        if (mxnCurrency) {
          mxnCurrency.exchangeRate = parseFloat(
            (1 / usdExchangeRate).toFixed(6),
          );
          mxnCurrency.lastUpdated = new Date();
          await this.currencyRepository.save(mxnCurrency);
        } else {
          console.error('MXN currency not found');
        }
      } else {
        console.error('Failed to parse USD exchange rate');
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
