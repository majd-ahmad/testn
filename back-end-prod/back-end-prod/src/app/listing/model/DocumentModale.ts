import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DocumentsModel {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  path: string;

  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }

  static create(id: string, path: string): DocumentsModel {
    return new DocumentsModel(id, path);
  }
}
