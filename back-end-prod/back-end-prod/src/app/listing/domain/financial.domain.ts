import { IFinancial } from "../model/FinancialModel";

export class FinancialDomain implements IFinancial {
  id: string;
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
  listingId: string;
}
