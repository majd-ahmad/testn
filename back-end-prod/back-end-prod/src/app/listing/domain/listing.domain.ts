import { ListingPdf, ListingPhoto, Status } from '@prisma/client';
import { FinancialDomain } from './financial.domain';
import { Decimal } from '@prisma/client/runtime/library';
import { DealType } from './enums/dealType.enum';
import { Industry } from './enums/industryType.enum';
import { BusinessStage } from './enums/businessStage.enum';
import { EntityType } from './enums/entityType.enum';
import { IListing } from '../model/ListingModel';

export class ListingDomain implements IListing {
  id: string;
  ownerId: string;
  rejectionReason?: string;
  isApproved: boolean;
  title: string;
  organizationName: string;
  aboutBusiness: string;
  assetOverview: string | null;
  location: string | null;
  dealType: DealType;
  industryType: Industry;
  establishmentDate: Date;
  isStartup: boolean;
  country: string;
  city: string;
  establishedDate: Date;
  businessAge: string[];
  businessOverview: string;
  price: Decimal;
  isSold: boolean;
  entityType: EntityType;
  businessStage: BusinessStage;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
  financial?: FinancialDomain;
  listingImages?: ListingPhoto[];
  listingPdfs?: ListingPdf[];
}