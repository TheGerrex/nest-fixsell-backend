import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumible } from './entities/consumible.entity';
import { CreateConsumibleDto } from './dto/create-consumible.dto';
import { UpdateConsumibleDto } from './dto/update-consumible.dto';
import { Printer } from 'src/printers/entities/printer.entity';
import * as path from 'path';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class ConsumiblesService {
  constructor(
    @InjectRepository(Consumible)
    private consumibleRepository: Repository<Consumible>,
    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,
    private fileUploadService: FileUploadService,
    private configService: ConfigService,
  ) {}

  async create(createConsumibleDto: CreateConsumibleDto) {
    const printers = await this.printerRepository.findByIds(
      createConsumibleDto.printersIds,
    );
    const consumible = this.consumibleRepository.create(createConsumibleDto);
    consumible.printers = printers;

    if (createConsumibleDto.img_url) {
      const newUrls = [];
      for (const tempFilePath of createConsumibleDto.img_url) {
        const url = new URL(tempFilePath);
        const oldPath = url.pathname.substring(1);
        const fileName = path.basename(oldPath);
        const decodedFileName = decodeURIComponent(fileName);
        const newPath = `imagenes/${encodeURIComponent(
          consumible.name.replace(/ /g, '_'),
        )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;

        await this.fileUploadService.renameFile(oldPath, newPath);
        const newUrl = `https://${this.configService.get(
          'AWS_BUCKET_NAME',
        )}.s3.amazonaws.com/${newPath}`;
        newUrls.push(newUrl);
      }
      consumible.img_url = newUrls;
    }

    await this.consumibleRepository.save(consumible);
    return consumible;
  }

  findAll() {
    return this.consumibleRepository.find({ relations: ['printers'] });
  }

  findOne(id: string) {
    return this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers'],
    });
  }

  async update(id: string, updateConsumibleDto: UpdateConsumibleDto) {
    await this.consumibleRepository.update({ id: id }, updateConsumibleDto);
    return this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers'],
    });
  }

  async remove(id: string) {
    const consumible = await this.consumibleRepository.findOneOrFail({
      where: { id: id },
      relations: ['printers'],
    });

    if (!consumible) {
      throw new NotFoundException('Consumible not found');
    }

    // Remove the relationship
    consumible.printers.forEach(async (printer) => {
      const index = printer.consumibles.findIndex((c) => c.id === id);
      if (index > -1) {
        printer.consumibles.splice(index, 1);
        await this.printerRepository.save(printer);
      }
    });

    // Now delete the consumible
    await this.consumibleRepository.remove(consumible);
    return consumible;
  }
}
