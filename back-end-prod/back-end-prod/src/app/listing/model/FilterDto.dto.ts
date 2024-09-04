import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { DealType } from '../domain/enums/dealType.enum';
import { Industry } from '../domain/enums/industryType.enum';

export class FilterDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  pageNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  pageSize: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @IsOptional()
  @ApiProperty({
    required: false,
  })
  @IsIn(['price', 'lastYearProfit', 'lastYearRevenue', 'title'])
  sortedBy?: 'price' | 'lastYearProfit' | 'lastYearRevenue' | 'title';

  @ApiProperty({
    required: false,
    isArray: true,
    type: DealType,
  })
  dealType?: DealType[];

  @ApiProperty({
    required: false,
    isArray: true,
    type: Industry,
  })
  industryType?: Industry[];

  @ApiProperty({
    required: false,
    isArray: true,
    type: String,
  })
  city?: string[];

  @ApiProperty({
    required: true,
  })
  maxPrice: string;

  @ApiProperty({
    required: false,
  })
  minPrice?: string;

  @ApiProperty({
    required: false,
  })
  lastCursor?: string;
}
