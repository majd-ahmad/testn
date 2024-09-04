import { Module } from '@nestjs/common';
import { IUploadServiceToken } from './IUploadService';
import { S3UploadService } from './s3-upload.service';

@Module({
  providers: [
    S3UploadService,

    {
      provide: IUploadServiceToken,
      useClass: S3UploadService,
    },
  ],
  exports: [
    S3UploadService,

    {
      provide: IUploadServiceToken,
      useClass: S3UploadService,
    },
  ],
})
export class S3FileUploadModule {}
