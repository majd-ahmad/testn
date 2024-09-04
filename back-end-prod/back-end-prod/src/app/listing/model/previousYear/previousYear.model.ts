import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { PreviousYearDomain } from '../../domain/previousYears.domain';

export interface IPreviousYear {
  year: number;
  value: number;
  type: PreviousYearType;
}

export enum PreviousYearType {
  NetSales = "netSales",
  NetProfit = "netProfit",
  Revenue = "revenue"
}
export class PreviousYearModel implements IPreviousYear {
  @ApiProperty()
  @IsString()
  id: string;
  
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() - 1)
  @ApiProperty()
  year: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  value: number;

  @IsEnum(PreviousYearType)
  @IsNotEmpty()
  @ApiProperty()
  type: PreviousYearType;

  constructor(data: IPreviousYear) {
    Object.assign(this, data);
  }

  static fromDomain(domain: PreviousYearDomain): PreviousYearModel {
    return new PreviousYearModel(domain);
  }
}