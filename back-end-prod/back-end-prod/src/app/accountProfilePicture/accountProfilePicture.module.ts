import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ProfilePictureController } from './accountProfilePicture.controller';
import {
  FileUploadModule,
  IUploadServiceToken,
  S3UploadService,
  SupabaseUploadService,
} from '../../libs/file-upload';
import { AccountProfilePictureService } from './accountProfilePicture.service';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [DatabaseModule, FileUploadModule],
  controllers: [ProfilePictureController],
  providers: [
    SupabaseUploadService,
    S3UploadService,
    {
      provide: IUploadServiceToken,
      useClass: ENV !== 'production' ? SupabaseUploadService : S3UploadService,
    },
    AccountProfilePictureService,
  ],
  exports: [],
})
export class AccountProfilePictureModule {}
