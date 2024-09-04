import { ApiProperty } from '@nestjs/swagger';
import {IsNotEmpty, IsString, Length} from 'class-validator';

export class VerifyCodeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
