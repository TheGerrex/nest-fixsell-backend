import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Body, Delete, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { diskStorage } from 'multer';
import { fileNamer, filePdfFilter, fileImageFilter } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('upload')
export class FileUploadController {

  constructor(
    private readonly fileUploadService: FileUploadService, 
    private readonly configService: ConfigService
  ) {}

  @Get('image/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.fileUploadService.getStaticProductImage(imageName)
    res.sendFile(path);
  }


  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      fileFilter: fileImageFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      })
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('rootFolder') rootFolder: string,
    @Body('subRootfolder') subRootfolder: string,
    @Body('childFolder') childFolder: string,
  ) {

    if (!file) {
      throw new BadRequestException('No hay archivo');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/upload/image/${file.filename}`

    return { secureUrl };
    // const url = await this.fileUploadService.uploadFile(
    //   file,
    //   rootFolder,
    //   subRootfolder,
    //   childFolder,
    // );
    // return { url };
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
