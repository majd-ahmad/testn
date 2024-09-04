import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateIsSold {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isSold: boolean;
}
