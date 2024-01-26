import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class FileUploadService {
  private s3;
  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file) {
    const params = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype, // Corrected casing
      ContentDisposition: 'inline',
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }

  async uploadMultipleFiles(files) {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(file);
      urls.push(url);
    }
    return urls;
  }
}
