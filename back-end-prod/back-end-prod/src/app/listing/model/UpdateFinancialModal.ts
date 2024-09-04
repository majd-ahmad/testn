import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { FinancialDomain } from '../domain/financial.domain';

export class UpdateFinancialModal {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  lastYearRevenue: number;
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
  @IsNotEmpty()
  @ApiProperty()
  totalDebt: number;

  constructor(
    lastYearRevenue: number,
    lastYearSales: number,
    lastYearProfit: number,
    ebitda: number,
    isDebt: boolean,
    totalDebt: number,
  ) {
    this.lastYearRevenue = lastYearRevenue;
    this.lastYearSales = lastYearSales;
    this.lastYearProfit = lastYearProfit;
    this.ebitda = ebitda;
    this.isDebt = isDebt;
    this.totalDebt = totalDebt;
  }

  static fromDomain(financialDomain: FinancialDomain): UpdateFinancialModal {
    return new UpdateFinancialModal(
      financialDomain.lastYearRevenue,
      financialDomain.lastYearSales,
      financialDomain.lastYearProfit,
      financialDomain.ebitda,
      financialDomain.isDebt,
      financialDomain.totalDebt,
    );
  }
}
