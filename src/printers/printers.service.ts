import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterPrinterDto } from './dto/filter-printer.dto';
import { Printer } from './entities/printer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import * as path from 'path';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ConfigService } from '@nestjs/config';
import { BrandsService } from './brands/brands.service';
import { CategoriesService } from './categories/categories.service';

@Injectable()
export class PrintersService {
  constructor(
    @InjectRepository(Printer)
    private printersRepository: Repository<Printer>,
    private fileUploadService: FileUploadService,
    private configService: ConfigService,
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
  ) {}

  async findAll(filtersPrinterDto: FilterPrinterDto = {}): Promise<Printer[]> {
    const {
      limit,
      offset = 0,
      printVelocity,
      brand,
      model,
      category,
      tags,
      powerConsumption,
      dimensions,
      maxPrintSizeSimple,
      maxPrintSize,
      printSize,
      maxPaperWeight,
      paperSizes,
      applicableOS,
      printerFunctions,
      barcode,
      ...filterProps
    } = filtersPrinterDto;

    let query = this.printersRepository
      .createQueryBuilder('printer')
      .leftJoinAndSelect('printer.deals', 'deals')
      .leftJoinAndSelect('printer.packages', 'packages')
      .leftJoinAndSelect('printer.consumibles', 'consumibles');

    Object.keys(filterProps).forEach((key) => {
      console.log(filterProps);
      if (filterProps[key] !== undefined) {
        const value =
          filterProps[key] === 'true'
            ? true
            : filterProps[key] === 'false'
            ? false
            : filterProps[key];
        query = query.andWhere(`printer.${key} = :${key}`, { [key]: value });
      }
    });

    if (brand) {
      query = query.andWhere('LOWER(printer.brand) IN (:...brand)', { brand });
    }

    if (model) {
      query = query.andWhere('LOWER(printer.model) = :model', { model });
    }

    if (category) {
      query = query.andWhere('LOWER(printer.category) IN (:...category)', {
        category,
      });
    }

    if (printSize) {
      query = query.andWhere('LOWER(printer.printSize) IN (:...printSize)', {
        printSize,
      });
    }

    if (tags) {
      query = query.andWhere('LOWER(printer.tags) = :tags', { tags });
    }

    if (powerConsumption) {
      query = query.andWhere(
        'LOWER(printer.powerConsumption) = :powerConsumption',
        { powerConsumption },
      );
    }

    if (dimensions) {
      query = query.andWhere('LOWER(printer.dimensions) = :dimensions', {
        dimensions,
      });
    }

    if (maxPrintSizeSimple) {
      query = query.andWhere(
        'LOWER(printer.maxPrintSizeSimple) = :maxPrintSizeSimple',
        { maxPrintSizeSimple },
      );
    }

    if (maxPrintSize) {
      query = query.andWhere('LOWER(printer.maxPrintSize) = :maxPrintSize', {
        maxPrintSize,
      });
    }

    if (maxPaperWeight) {
      query = query.andWhere(
        'LOWER(printer.maxPaperWeight) = :maxPaperWeight',
        { maxPaperWeight },
      );
    }

    if (paperSizes) {
      query = query.andWhere('LOWER(printer.paperSizes) = :paperSizes', {
        paperSizes,
      });
    }

    if (applicableOS) {
      query = query.andWhere('LOWER(printer.applicableOS) = :applicableOS', {
        applicableOS,
      });
    }

    if (printerFunctions) {
      query = query.andWhere(
        'LOWER(printer.printerFunctions) = :printerFunctions',
        { printerFunctions },
      );
    }

    if (barcode) {
      query = query.andWhere('LOWER(printer.barcode) = :barcode', { barcode });
    }

    if (printVelocity) {
      const velocityConditions = printVelocity.map((velocity) => {
        const [min, max] = velocity.split('-').map(Number);
        if (max) {
          return `CAST(printer.printVelocity AS INTEGER) >= ${min} AND CAST(printer.printVelocity AS INTEGER) <= ${max}`;
        } else {
          return `CAST(printer.printVelocity AS INTEGER) >= ${min}`;
        }
      });
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(velocityConditions.join(' OR '));
        }),
      );
    }

    if (limit) {
      query = query.take(limit);
    }

    query = query.skip(offset);

    return await query.getMany();
  }

  async findOne(term: string): Promise<Printer> {
    let printer: Printer;

    if (isUUID(term)) {
      printer = await this.printersRepository.findOne({
        where: { id: term as any },
      });
    } else {
      printer = await this.printersRepository
        .createQueryBuilder('printer')
        .leftJoinAndSelect('printer.deals', 'deals')
        .leftJoinAndSelect('printer.packages', 'packages')
        .leftJoinAndSelect('printer.consumibles', 'consumibles')
        .where(`UPPER(printer.model) = :model`, {
          model: term.toUpperCase(),
        })
        .getOne();
    }

    if (!printer) {
      throw new NotFoundException(`Printer not found with term: ${term}`);
    }

    return printer;
  }

  async create(createPrinterDto: CreatePrinterDto): Promise<Printer> {
    // Check if brand exists
    if (createPrinterDto.brand) {
      const brand = await this.brandsService.findByName(createPrinterDto.brand);
      if (!brand) {
        throw new NotFoundException(
          `Brand ${createPrinterDto.brand} not found`,
        );
      }
    }
    // check if catergory exists
    if (createPrinterDto.category) {
      const category = await this.categoriesService.findByName(
        createPrinterDto.category,
      );
      if (!category) {
        throw new NotFoundException(
          `Category ${createPrinterDto.category} not found`,
        );
      }
    }
    try {
      const newPrinter = this.printersRepository.create(createPrinterDto);
      let savedPrinter = await this.printersRepository.save(newPrinter);

      if (createPrinterDto.img_url) {
        const newUrls = [];
        for (const tempFilePath of createPrinterDto.img_url) {
          const url = new URL(tempFilePath);
          const oldPath = url.pathname.substring(1);
          const fileName = path.basename(oldPath);
          const decodedFileName = decodeURIComponent(fileName);
          const newPath = `Multifuncionales/imagenes/${encodeURIComponent(
            savedPrinter.brand.replace(/ /g, '_'),
          )}/${encodeURIComponent(
            savedPrinter.model.replace(/ /g, '_'),
          )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;

          await this.fileUploadService.renameFile(oldPath, newPath);
          const newUrl = `https://${this.configService.get(
            'AWS_BUCKET_NAME',
          )}.s3.amazonaws.com/${newPath}`;
          newUrls.push(newUrl);
        }
        savedPrinter.img_url = newUrls;
        savedPrinter = await this.printersRepository.save(savedPrinter);
      }

      if (createPrinterDto.datasheet_url) {
        const url = new URL(createPrinterDto.datasheet_url);
        const oldPath = url.pathname.substring(1);
        const fileName = path.basename(oldPath);
        const decodedFileName = decodeURIComponent(fileName);
        const newPath = `Multifuncionales/datasheets/${encodeURIComponent(
          savedPrinter.brand.replace(/ /g, '_'),
        )}/${encodeURIComponent(
          savedPrinter.model.replace(/ /g, '_'),
        )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;

        await this.fileUploadService.renameFile(oldPath, newPath);
        const newUrl = `https://${this.configService.get(
          'AWS_BUCKET_NAME',
        )}.s3.amazonaws.com/${newPath}`;
        savedPrinter.datasheet_url = newUrl;
        savedPrinter = await this.printersRepository.save(savedPrinter);
      }

      return savedPrinter;
    } catch (error) {
      console.error('Error while creating printer:', error);
      if (error.code === '23505') {
        throw new BadRequestException(`${createPrinterDto.model} ya existe.`);
      }
      throw new InternalServerErrorException('Algo salio muy mal.');
    }
  }

  async update(
    id: string,
    updatePrinterDto: UpdatePrinterDto,
  ): Promise<Printer> {
    let printerToUpdate = await this.printersRepository.findOne({
      where: { id },
    });

    if (!printerToUpdate) {
      throw new NotFoundException(`Printer with ID ${id} not found`);
    }

    // Check if brand exists
    if (updatePrinterDto.brand) {
      const brand = await this.brandsService.findByName(updatePrinterDto.brand);
      if (!brand) {
        throw new NotFoundException(
          `Brand ${updatePrinterDto.brand} not found`,
        );
      }
    }

    // check if catergory exists
    if (updatePrinterDto.category) {
      const category = await this.categoriesService.findByName(
        updatePrinterDto.category,
      );
      if (!category) {
        throw new NotFoundException(
          `Category ${updatePrinterDto.category} not found`,
        );
      }
    }

    if (updatePrinterDto.img_url) {
      const newUrls = [];
      for (const tempFilePath of updatePrinterDto.img_url) {
        if (tempFilePath.includes('temp')) {
          // This is a new image
          const url = new URL(tempFilePath);
          const oldPath = url.pathname.substring(1);
          const fileName = path.basename(oldPath);
          const decodedFileName = decodeURIComponent(fileName).replace(
            /â¯/g,
            '_',
          );
          const newPath = `Multifuncionales/imagenes/${encodeURIComponent(
            printerToUpdate.brand.replace(/ /g, '_'),
          )}/${encodeURIComponent(
            printerToUpdate.model.replace(/ /g, '_'),
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
      updatePrinterDto.img_url = newUrls;
    }

    if (updatePrinterDto.datasheet_url) {
      const url = new URL(updatePrinterDto.datasheet_url);
      const oldPath = url.pathname.substring(1);
      const fileName = path.basename(oldPath);
      const decodedFileName = decodeURIComponent(fileName);
      const newPath = `Multifuncionales/datasheets/${encodeURIComponent(
        printerToUpdate.brand.replace(/ /g, '_'),
      )}/${encodeURIComponent(
        printerToUpdate.model.replace(/ /g, '_'),
      )}/${encodeURIComponent(decodedFileName.replace(/ /g, '_'))}`;
      const newUrl = `https://${this.configService.get(
        'AWS_BUCKET_NAME',
      )}.s3.amazonaws.com/${newPath}`;
      if (newUrl !== updatePrinterDto.datasheet_url) {
        // The file has been edited, so rename it
        await this.fileUploadService.renameFile(oldPath, newPath);
      }
      updatePrinterDto.datasheet_url = newUrl;
    }

    const updateResult = await this.printersRepository.update(
      id,
      updatePrinterDto,
    );

    if (!updateResult.affected) {
      throw new NotFoundException('Printer not found');
    }

    const updatedPrinter = await this.printersRepository.findOne({
      where: { id },
    });

    if (!updatedPrinter) {
      throw new NotFoundException('Printer not found');
    }

    return updatedPrinter;
  }

  async remove(id: string): Promise<void> {
    const deleteResult = await this.printersRepository.delete(id);
    if (!deleteResult.affected) {
      throw new NotFoundException('Printer not found');
    }
  }

  async removeAll(): Promise<string> {
    const deleteResult = await this.printersRepository.delete({});
    if (!deleteResult.affected) {
      throw new NotFoundException('Printers not found');
    }
    return 'Deleted all Printers';
  }
}
