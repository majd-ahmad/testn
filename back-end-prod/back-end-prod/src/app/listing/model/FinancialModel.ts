import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsBoolean, IsNotEmpty, IsNumber, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { FinancialDomain } from '../domain/financial.domain';
import { Type } from 'class-transformer';
import { PreviousYearModel } from './previousYear/previousYear.model';

export interface IFinancial {
  lastYearRevenue: number;
  lastYearSales: number;
  lastYearProfit: number;
  ebitda?: number;
  isDebt: boolean;
  totalDebt?: number;
  totalInventoryValue?: number;
  totalAssetValue?: number;
  customerAcquisitionCost?: number;
  roi?: number;
}

export class FinancialModel implements IFinancial {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearRevenue: number;

  @ValidateNested({ each: true })
  @Type(() => PreviousYearModel)
  @ArrayMinSize(0)
  @ApiProperty()
  previousYearsValues: PreviousYearModel[];

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearSales: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearProfit: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  ebitda?: number;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isDebt: boolean;

  @IsNumber()
  @ValidateIf((object) => object.isDebt === true)
  @IsNotEmpty()
  @ApiProperty()
  totalDebt?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  totalInventoryValue?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  totalAssetValue?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  customerAcquisitionCost?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  roi?: number;

  constructor(data: IFinancial) {
    Object.assign(this, data);
  }

  static fromDomain(domain: FinancialDomain): FinancialModel {
    return new FinancialModel(domain);
  }
}
