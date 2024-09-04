import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';
import { IFinancial } from './FinancialModel';

export class CreateOrUpdateFinancialCommand implements IFinancial {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearRevenue: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  totalInventoryValue: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  totalAssetValue: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  customerAcquisitionCost: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearSales: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearProfit: number;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  ebitda: number;
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isDebt: boolean;
  @IsNumber()
  @ValidateIf((object) => object.isDebt === true)
  @IsNotEmpty()
  @ApiProperty()
  totalDebt: number;
}
