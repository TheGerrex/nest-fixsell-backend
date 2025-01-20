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
  ) {
    // Call initializeCurrencies when service is created
    this.initializeCurrencies();
  }

  private async initializeCurrencies() {
    const currencies = await this.getAllCurrencies();

    // Check if USD exists, if not create it
    const usdExists = currencies.some((c) => c.name.toLowerCase() === 'usd');
    if (!usdExists) {
      await this.addCurrency({ name: 'USD' });
      console.log('USD currency initialized');
    }

    // Check if MXN exists, if not create it
    const mxnExists = currencies.some((c) => c.name.toLowerCase() === 'mxn');
    if (!mxnExists) {
      await this.addCurrency({ name: 'MXN' });
      console.log('MXN currency initialized');
    }
  }

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
    console.log('Current currencies before update:', currencies);

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
      console.log('Scraped exchange rate text:', exchangeRateText);

      const usdExchangeRate = parseFloat(exchangeRateText.replace(',', '.'));
      console.log('Parsed USD exchange rate:', usdExchangeRate);

      if (!isNaN(usdExchangeRate)) {
        let mxnCurrency: Currency | undefined;
        const updatedCurrencies = [];

        for (const currency of currencies) {
          if (currency.name.toLowerCase() === 'usd') {
            currency.exchangeRate = usdExchangeRate;
            currency.lastUpdated = new Date();
            const updatedUSD = await this.currencyRepository.save(currency);
            updatedCurrencies.push(updatedUSD);
            console.log('Updated USD currency:', updatedUSD);
          } else if (currency.name.toLowerCase() === 'mxn') {
            mxnCurrency = currency;
          }
        }

        if (mxnCurrency) {
          mxnCurrency.exchangeRate = parseFloat(
            (1 / usdExchangeRate).toFixed(6),
          );
          mxnCurrency.lastUpdated = new Date();
          const updatedMXN = await this.currencyRepository.save(mxnCurrency);
          updatedCurrencies.push(updatedMXN);
          console.log('Updated MXN currency:', updatedMXN);
        } else {
          console.error('MXN currency not found in database');
        }

        const finalCurrencies = await this.currencyRepository.find();
        console.log('Final currencies after update:', finalCurrencies);

        return finalCurrencies;
      } else {
        const error = 'Failed to parse USD exchange rate';
        console.error(error);
        throw new Error(error);
      }
    } catch (error) {
      console.error('Failed to update exchange rates:', error);
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  handleCron() {
    this.updateExchangeRates();
  }
}
