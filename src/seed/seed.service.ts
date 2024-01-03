import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Printer } from 'src/printers/entities/printer.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(Printer)
    private readonly printerRepository: Repository<Printer>
  ) {}

  async executeSeed() {
    // Delete all existing records in the Printer table
    await this.printerRepository.delete({});

    // Read data from the JSON file
    const jsonString = fs.readFileSync("src/seed/fixsell_db.printers.json", 'utf-8');
    const printersData = JSON.parse(jsonString);

    // Loop through the data and create PrinterEntity instances
    for (const printerData of printersData) {
      const printer = this.printerRepository.create(printerData);
      await this.printerRepository.save(printer);
    }

    return "Seed executed."
  }
}
