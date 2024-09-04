import { Injectable } from '@nestjs/common';
import { IUploadService } from './IUploadService';
import * as AWS from 'aws-sdk';
import * as path from 'path';

@Injectable()
export class S3UploadService implements IUploadService {
  private awsClient: AWS.S3;

  setS3Client() {
    try {
      this.awsClient = new AWS.S3({
        region: process.env.MY_AWS_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });
    } catch (error) {
      throw new Error('Aws S3 client is not initialized.', { cause: error });
    }
  }
  async onModuleInit() {
    this.setS3Client();
  }
  async uploadFile(file: Express.Multer.File): Promise<Express.Multer.File> {
    console.log('file', file);
    const folderName =
      path.extname(file.originalname).toLowerCase() === '.pdf'
        ? process.env.S3_AWS_PDF_FOLDER
        : process.env.S3_AWS_IMAGE_FOLDER;
    const params: AWS.S3.PutObjectRequest = {
      Bucket: `${process.env.S3_AWS_BUCKET}/${folderName}`,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: 'mimetype',
      ContentDisposition: 'inline',
    };
    try {
      const s3Response = await this.awsClient.upload(params).promise();
      console.log(s3Response);
      return file;
    } catch (e) {
      console.log(e);
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    const folderName =
      path.extname(fileId).toLowerCase() === '.pdf'
        ? process.env.S3_AWS_PDF_FOLDER
        : process.env.S3_AWS_IMAGE_FOLDER;
    const s3Response = await this.awsClient
      .deleteObject({
        Bucket: `${process.env.S3_AWS_BUCKET}/${folderName}`,
        Key: fileId,
      })
      .promise();
    return s3Response.$response.httpResponse.statusCode === 204;
  }
}
