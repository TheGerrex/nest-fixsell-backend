import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, IAM } from 'aws-sdk';

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
}
