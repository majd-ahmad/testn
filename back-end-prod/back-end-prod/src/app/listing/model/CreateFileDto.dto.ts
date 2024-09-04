import { ApiProperty } from '@nestjs/swagger';
import { IsImageFileExtension } from '../validators/image-files-extension.validator';
import { IsPdfFileExtension } from '../validators/pdf-files-extension.validator';

export class CreateImageFileDto {
  @ApiProperty()
  @IsImageFileExtension()
  file: Express.Multer.File;
}

export class CreatePdfFileDto {
  @ApiProperty()
  @IsPdfFileExtension()
  file: Express.Multer.File;
}
