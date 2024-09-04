import { IsDate, IsNumber, IsString } from 'class-validator';

export class CreateListingFilesDto {
  @IsString()
  fileName: string;
  @IsNumber()
  filesSize: number;
  @IsDate()
  uploadDate: Date;
}
