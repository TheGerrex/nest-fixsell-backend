import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, IAM } from 'aws-sdk';
import { existsSync } from 'fs';
import { join } from 'path';
import { throwError } from 'rxjs';

@Injectable()
export class FileUploadService {
  private readonly s3: S3;
  private readonly iam: IAM;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });

    this.iam = new IAM({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async checkPermissions() {
    const params = {
      PolicySourceArn: 'arn:aws:iam::841545348451:user/thegerrex', // replace with your IAM user ARN
      ActionNames: ['s3:DeleteObject'],
    };

    try {
      const data = await this.iam.simulatePrincipalPolicy(params).promise();
      console.log(data);
    } catch (error) {
      console.log(error, error.stack);
    }
  }

  async uploadFile(file, productFolder, typeFolder, brandFolder, modelFolder) {
    let filePath;
    const formattedFileName = this.formatFileName(file.originalname);
    if (brandFolder && modelFolder) {
      // If the brand and model are provided, use them in the file name
      brandFolder = this.formatFileName(brandFolder);
      modelFolder = this.formatFileName(modelFolder);
      filePath = `${productFolder}/${typeFolder}/${brandFolder}/${modelFolder}/${Date.now()}-${formattedFileName}`;
    } else {
      // Otherwise, create a temporary file with a unique name
      filePath = `${productFolder}/temp/${Date.now()}-${file.originalname}`;
    }

    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentDisposition: 'inline',
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }

  async uploadMultipleFiles(files, productFolder, typeFolder, brandFolder, modelFolder) {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(file, productFolder, typeFolder, brandFolder, modelFolder);
      urls.push(url);
    }
    return urls;
  }

  async deleteFile(url: string) {
    await this.checkPermissions();

    const filePath = url.replace(
      `https://${this.configService.get('AWS_BUCKET_NAME')}.s3.amazonaws.com/`,
      '',
    );
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: filePath,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        throw new Error('File does not exist');
      } else {
        throw error;
      }
    }
  }

  async renameFile(oldPath, newPath) {
    const copyParams = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      CopySource: `${this.configService.get('AWS_BUCKET_NAME')}/${oldPath}`,
      Key: newPath,
    };

    try {
      await this.s3.copyObject(copyParams).promise();
    } catch (error) {
      throw new BadRequestException(`Failed to copy file from ${oldPath} to ${newPath}: ${error.message}`);
    }
  
    const deleteParams = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: oldPath,
    };

    try {
      await this.s3.deleteObject(deleteParams).promise();
    } catch (error) {
      throw new BadRequestException(`Failed to delete file at ${oldPath}: ${error.message}`);
    }
  }

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
        throw new BadRequestException(`No se encontro producto con la imagen ${imageName}`);
    }

    return path;
  }

  private formatFileName(fileName: string): string {
    return fileName.replace(/ /g, '_');
  }
}
