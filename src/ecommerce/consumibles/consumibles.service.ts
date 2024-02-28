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
    // // Check if brand exists
    // if (createConsumibleDto.brand) {
    //   const brand = await this.brandsService.findByName(createConsumibleDto.brand);
    //   if (!brand) {
    //     throw new NotFoundException(
    //       `Brand ${createConsumibleDto.brand} not found`,
    //     );
    //   }
    // }

    // // check if catergory exists
    // if (createConsumibleDto.category) {
    //   const category = await this.categoriesService.findByName(
    //     createConsumibleDto.category,
    //   );
    //   if (!category) {
    //     throw new NotFoundException(
    //       `Category ${createConsumibleDto.category} not found`,
    //     );
    //   }
    // }

    try {
      const printers = await this.printerRepository.findByIds(
        createConsumibleDto.printersIds,
      );
      const newConsumible =
        this.consumibleRepository.create(createConsumibleDto);
      newConsumible.printers = printers;
      let savedConsumible = await this.consumibleRepository.save(newConsumible);

      // Handle counterpartId
      if (createConsumibleDto.counterpartId) {
        const counterpart = await this.consumibleRepository.findOne({
          where: { id: createConsumibleDto.counterpartId },
        });
        if (!counterpart) {
          throw new NotFoundException(
            `Counterpart with ID ${createConsumibleDto.counterpartId} not found`,
          );
        }
        newConsumible.counterpart = counterpart;
      }
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
      relations: ['printers', 'counterpart'],
    });
  }

  findOne(id: string) {
    return this.consumibleRepository.findOne({
      where: { id },
      relations: ['printers', 'counterpart'],
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

    // Handle counterpartId separately
    if (updateConsumibleDto.counterpartId) {
      console.log(
        'Updating counterpart with ID:',
        updateConsumibleDto.counterpartId,
      );

      const counterpart = await this.consumibleRepository.findOne({
        where: { id: updateConsumibleDto.counterpartId },
      });

      if (!counterpart) {
        throw new NotFoundException(
          `Counterpart with ID ${updateConsumibleDto.counterpartId} not found`,
        );
      }

      console.log('Found counterpart to update:', counterpart);

      consumibleToUpdate.counterpart = counterpart;
      await this.consumibleRepository.save(consumibleToUpdate);

      console.log('Updated counterpart in consumible:', consumibleToUpdate);

      // Create a new object without counterpartId
      const { counterpartId, ...updateDtoWithoutCounterpartId } =
        updateConsumibleDto;
      updateConsumibleDto = updateDtoWithoutCounterpartId;
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
    
    // Set counterpart of all Consumibles that reference the Consumible to be deleted to null
    const counterparts = await this.consumibleRepository.createQueryBuilder('consumible')
    .where('consumible.counterpartId = :id', { id: consumible.id })
    .getMany();
    for (const counterpart of counterparts) {
      counterpart.counterpart = null;
      await this.consumibleRepository.save(counterpart);
    }

    // Now delete the consumible
    await this.consumibleRepository.remove(consumible);
    return consumible;
  }
}
