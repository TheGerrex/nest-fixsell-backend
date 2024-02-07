import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Delete,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Body('rootFolder') rootFolder: string,
    @Body('subRootfolder') subRootfolder: string,
    @Body('childFolder') childFolder: string,
  ) {
    const url = await this.fileUploadService.uploadFile(
      file,
      rootFolder,
      subRootfolder,
      childFolder,
    );
    return { url };
  }

  @Post('image/multiple')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadMultipleFiles(
    @UploadedFiles() files,
    @Body('rootFolder') rootFolder: string,
    @Body('subRootfolder') subRootfolder: string,
    @Body('childFolder') childFolder: string,) {
    const urls = await this.fileUploadService.uploadMultipleFiles(
      files,
      rootFolder,
      subRootfolder,
      childFolder,
      );
    return { urls };
  }

  @Post('pdf')
  @UseInterceptors(
    FileInterceptor('pdf', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadPdf(@UploadedFile() file) {
    const url = await this.fileUploadService.uploadFile(
      file,
      'rootFolder',
      'subRootfolder',
      'childFolder',
    );
    return { url };
  }

  @Post('pdf/multiple')
  @UseInterceptors(
    FilesInterceptor('pdf', 10, {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  async uploadMultiplePdfs(
    @UploadedFiles() files,
    @Body('rootFolder') rootFolder: string,
    @Body('subRootfolder') subRootfolder: string,
    @Body('childFolder') childFolder: string,) {
    const urls = await this.fileUploadService.uploadMultipleFiles(
      files, 
      rootFolder,
      subRootfolder,
      childFolder);
    return { urls };
  }

  // delete file
  @Delete('file')
  async deleteFile(@Body('url') url: string) {
    await this.fileUploadService.deleteFile(url);
    return { message: 'File deleted successfully' };
  }
}
