import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Delete,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { diskStorage } from 'multer';
import { fileNamer, filePdfFilter, fileImageFilter } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from '../auth/public.decorator';
@Controller('upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('image/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.fileUploadService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      fileFilter: fileImageFilter,
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('productFolder') productFolder: string,
    @Body('typeFolder') typeFolder: string,
    @Body('brandFolder') brandFolder: string,
    @Body('modelFolder') modelFolder: string,
  ) {
    if (!file) {
      throw new BadRequestException('No hay archivo');
    }

    const url = await this.fileUploadService.uploadFile(
      file,
      productFolder,
      typeFolder,
      brandFolder,
      modelFolder,
    );
    return { url };
  }

  @Post('image/multiple')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      fileFilter: fileImageFilter,
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('productFolder') productFolder: string,
    @Body('typeFolder') typeFolder: string,
    @Body('brandFolder') brandFolder: string,
    @Body('modelFolder') modelFolder: string,
  ) {
    if (!files) {
      throw new BadRequestException('No hay archivo');
    }

    const urls = await this.fileUploadService.uploadMultipleFiles(
      files,
      productFolder,
      typeFolder,
      brandFolder,
      modelFolder,
    );
    return { urls };
  }

  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('pdf', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      fileFilter: filePdfFilter,
    }),
  )
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
    @Body('productFolder') productFolder: string,
    @Body('typeFolder') typeFolder: string,
    @Body('brandFolder') brandFolder: string,
    @Body('modelFolder') modelFolder: string,
  ) {
    const url = await this.fileUploadService.uploadFile(
      file,
      productFolder,
      typeFolder,
      brandFolder,
      modelFolder,
    );
    return { url };
  }

  @Post('pdf/multiple')
  @UseInterceptors(
    FilesInterceptor('pdf', 10, {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      fileFilter: filePdfFilter,
    }),
  )
  async uploadMultiplePdfs(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('productFolder') productFolder: string,
    @Body('typeFolder') typeFolder: string,
    @Body('brandFolder') brandFolder: string,
    @Body('modelFolder') modelFolder: string,
  ) {
    const urls = await this.fileUploadService.uploadMultipleFiles(
      files,
      productFolder,
      typeFolder,
      brandFolder,
      modelFolder,
    );
    return { urls };
  }

  // delete file
  @Delete('file')
  async deleteFile(@Body('url') url: string) {
    await this.fileUploadService.deleteFile(url);
    return { message: 'File deleted successfully' };
  }
}
