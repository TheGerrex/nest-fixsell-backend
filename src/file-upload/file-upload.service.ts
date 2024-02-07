import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileUploadService {
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
  }

  async uploadFile(file, rootFolder, subRootFolder, childFolder) {
    const filePath = `${rootFolder}/${subRootFolder}/${childFolder}/${Date.now()}-${
      file.originalname
    }`;

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

  async uploadMultipleFiles(files) {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadFile(
        file,
        'rootFolder',
        'subRootFolder',
        'childFolder',
      );
      urls.push(url);
    }
    return urls;
  }
}
