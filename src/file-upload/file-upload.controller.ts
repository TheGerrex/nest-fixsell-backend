import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';

@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadFile(@UploadedFile() file) {
    const url = await this.fileUploadService.uploadFile(file);
    return { url };
  }

  @Post('image/multiple')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const urls = await this.fileUploadService.uploadMultipleFiles(files);
    return { urls };
  }

  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('pdf', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadPdf(@UploadedFile() file) {
    const url = await this.fileUploadService.uploadFile(file);
    return { url };
  }

  @Post('pdf/multiple')
  @UseInterceptors(
    FilesInterceptor('pdf', 10, {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadMultiplePdfs(@UploadedFiles() files) {
    const urls = await this.fileUploadService.uploadMultipleFiles(files);
    return { urls };
  }
}
