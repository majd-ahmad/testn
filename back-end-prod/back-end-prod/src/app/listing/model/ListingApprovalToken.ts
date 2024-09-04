import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ListingApprovalTokenModel {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  listingId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
