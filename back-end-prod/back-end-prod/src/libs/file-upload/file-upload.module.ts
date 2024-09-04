import { Module } from '@nestjs/common';
import { SupabaseUploadService } from './supabase-upload.service';
import { IUploadServiceToken } from './IUploadService';
import { S3UploadService } from './s3-upload.service';

const ENV = process.env.NODE_ENV;
@Module({
  providers: [
    SupabaseUploadService,
    S3UploadService,
    {
      provide: IUploadServiceToken,
      useClass: ENV !== 'production' ? SupabaseUploadService : S3UploadService,
    },
  ],
  exports: [
    SupabaseUploadService,
    S3UploadService,
    {
      provide: IUploadServiceToken,
      useClass: ENV !== 'production' ? SupabaseUploadService : S3UploadService,
    },
  ],
})
export class FileUploadModule {}
