import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { URL } from 'url';
import { BrandsService } from 'src/printers/brands/brands.service';
import { CategoriesService } from 'src/printers/categories/categories.service';
@Injectable()
export class ConsumiblesService {
  constructor(
    @InjectRepository(Consumible)
    private consumibleRepository: Repository<Consumible>,

    @InjectRepository(Printer)
    private printerRepository: Repository<Printer>,

    private fileUploadService: FileUploadService,
    private configService: ConfigService,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
  ) {}

  async create(createConsumibleDto: CreateConsumibleDto) {
    try {
      let printers = [];
      if (
        createConsumibleDto.printersIds &&
        Array.isArray(createConsumibleDto.printersIds) &&
        createConsumibleDto.printersIds.length > 0
      ) {
        printers = await this.printerRepository.findByIds(
          createConsumibleDto.printersIds,
        );
      }
      const newConsumible =
        this.consumibleRepository.create(createConsumibleDto);
      newConsumible.printers = printers;

      // Handle counterpartIds
      if (
        createConsumibleDto.counterpartIds &&
        Array.isArray(createConsumibleDto.counterpartIds) &&
        createConsumibleDto.counterpartIds.length > 0
      ) {
        const counterparts = await this.consumibleRepository.findByIds(
          createConsumibleDto.counterpartIds,
        );
        if (counterparts.length !== createConsumibleDto.counterpartIds.length) {
          throw new NotFoundException(
            `One or more counterparts with provided IDs not found`,
          );
        }
        newConsumible.counterparts = counterparts;
      }

      let savedConsumible = await this.consumibleRepository.save(newConsumible);

      if (createConsumibleDto.img_url) {
        const newUrls = [];
        for (const tempFilePath of createConsumibleDto.img_url) {
          const url = new URL(tempFilePath);
          const oldPath = url.pathname.substring(1);
          const fileName = path.basename(oldPath);
          const decodedFileName = decodeURIComponent(fileName);
          const newPath = `Consumibles/imagenes/${encodeURIComponent(
            savedConsumible.brand.replace(/ /g, '_'),
          )}/${encodeURIComponent(
            savedConsumible.name.replace(/ /g, '_'),
          )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;

          await this.fileUploadService.renameFile(oldPath, newPath);
          const newUrl = `https://${this.configService.get(
            'AWS_BUCKET_NAME',
          )}.s3.amazonaws.com/${newPath}`;
          newUrls.push(newUrl);
        }
        savedConsumible.img_url = newUrls;
        savedConsumible = await this.consumibleRepository.save(savedConsumible);
      }
      return savedConsumible;
    } catch (error) {
      console.error('Error al crear consumible:', error);
      if (error.code === '23505') {
        throw new BadRequestException(`${createConsumibleDto.name} ya existe.`);
      }
      throw new InternalServerErrorException('Algo salio muy mal.');
    }
  }

  findAll() {
    return this.consumibleRepository.find({
      relations: ['printers', 'counterparts'],
    });
  }

  findOne(id: string) {
    return this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers', 'counterparts'],
    });
  }

  async update(id: string, updateConsumibleDto: UpdateConsumibleDto) {
    console.log('Updating consumible with ID:', id);

    const consumibleToUpdate = await this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers'],
    });

    if (!consumibleToUpdate) {
      throw new NotFoundException(`Consumible with ID ${id} not found`);
    }

    console.log('Found consumible to update:', consumibleToUpdate);

    // Handle printersIds separately
    if (updateConsumibleDto.printerIds) {
      console.log(
        'Updating printers with IDs:',
        updateConsumibleDto.printerIds,
      );

      const printers = await this.printerRepository.findByIds(
        updateConsumibleDto.printerIds,
      );

      console.log('Found printers to update:', printers);

      consumibleToUpdate.printers = printers;
      await this.consumibleRepository.save(consumibleToUpdate);

      console.log('Updated printers in consumible:', consumibleToUpdate);

      // Create a new object without printerIds
      const { printerIds, ...updateDtoWithoutPrinterIds } = updateConsumibleDto;
      updateConsumibleDto = {
        ...updateDtoWithoutPrinterIds,
        printerIds: updateConsumibleDto.printerIds,
      };
      delete updateConsumibleDto.printerIds;
    }

    // Handle counterpartIds separately
    if (updateConsumibleDto.counterpartIds) {
      console.log(
        'Updating counterparts with IDs:',
        updateConsumibleDto.counterpartIds,
      );

      const counterparts = await this.consumibleRepository.findByIds(
        updateConsumibleDto.counterpartIds,
      );

      console.log('Found counterparts to update:', counterparts);

      consumibleToUpdate.counterparts = counterparts;
      await this.consumibleRepository.save(consumibleToUpdate);

      console.log('Updated counterparts in consumible:', consumibleToUpdate);

      // Create a new object without counterpartIds
      const { counterpartIds, ...updateDtoWithoutCounterpartIds } =
        updateConsumibleDto;
      updateConsumibleDto = updateDtoWithoutCounterpartIds;
    }

    if (updateConsumibleDto.img_url) {
      const newUrls = [];
      for (const tempFilePath of updateConsumibleDto.img_url) {
        if (tempFilePath.includes('temp')) {
          // This is a new image
          const url = new URL(tempFilePath);
          const oldPath = url.pathname.substring(1);
          const fileName = path.basename(oldPath);
          const decodedFileName = decodeURIComponent(fileName).replace(
            /â¯/g,
            '_',
          );
          const newPath = `Consumibles/imagenes/${encodeURIComponent(
            consumibleToUpdate.brand.replace(/ /g, '_'),
          )}/${encodeURIComponent(
            (consumibleToUpdate as any).name.replace(/ /g, '_'),
          )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;
          const newUrl = `https://${this.configService.get(
            'AWS_BUCKET_NAME',
          )}.s3.amazonaws.com/${newPath}`;
          if (newUrl !== tempFilePath) {
            try {
              // The file has been edited, so rename it
              await this.fileUploadService.renameFile(oldPath, newPath);
            } catch (error) {
              throw new BadRequestException(
                `Failed to rename file from ${oldPath} to ${newPath}: ${error.message}`,
              );
            }
          }
          const decodedNewUrl = decodeURIComponent(newUrl);
          newUrls.push(decodedNewUrl);
        } else {
          // This is an existing image
          newUrls.push(tempFilePath);
        }
      }
      updateConsumibleDto.img_url = newUrls;
    }

    await this.consumibleRepository.update(id, updateConsumibleDto);

    console.log('Updated consumible:', updateConsumibleDto);

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
