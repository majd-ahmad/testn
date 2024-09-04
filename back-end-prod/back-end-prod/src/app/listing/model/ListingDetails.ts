import { calculateAge } from 'src/utils/DateHelpers';
import { ListingDomain } from '../domain/listing.domain';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { getImageFileLink, getPdfFileLink } from 'src/utils/FileHelpers';
import { IListing } from './ListingModel';
import { Industry } from '../domain/enums/industryType.enum';
import { DealType } from '../domain/enums/dealType.enum';
import { BusinessStage } from '../domain/enums/businessStage.enum';
import { EntityType } from '../domain/enums/entityType.enum';

export class ListingDetails implements IListing {

  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string | null;

  @ApiProperty()
  location: string | null;

  @ApiProperty()
  country: string | null;

  @ApiProperty()
  city: string | null;

  @ApiProperty()
  price: number | null;

  @ApiProperty()
  industryType: Industry | null;

  @ApiProperty()
  businessAge: any;

  @ApiProperty()
  organizationName: string | null;

  @ApiProperty()
  establishmentDate: Date;

  @ApiProperty()
  dealType: DealType | null;

  @ApiProperty()
  businessOverview: string;

  @ApiProperty()
  isStartup: boolean;

  @ApiProperty()
  photos: string[] | null;

  @ApiProperty()
  pdfs: string[] | null;

  @ApiProperty()
  annualRevenue: number | null;

  @ApiProperty()
  annualSales: number | null;

  @ApiProperty()
  annualProfit: number | null;

  @ApiProperty()
  isDebt: boolean;

  @ApiProperty()
  ebitda: number | null;

  @ApiProperty()
  totalDebt: number | null;
  
  @ApiProperty()
  ownerId: string;

  @ApiPropertyOptional()
  establishedDate: Date | null;

  @ApiPropertyOptional()
  businessStage: BusinessStage | null;

  @ApiPropertyOptional()
  entityType: EntityType | null;

  @ApiPropertyOptional()
  assetOverview: string | null;

  @ApiPropertyOptional()
  aboutBusiness: string | null;

  @ApiPropertyOptional()
  rejectionReason: string | null;

  constructor(data: IListing) {
    Object.assign(this, data);
  }

  static fromDomain(listingDomain: ListingDomain): ListingDetails {
    try {
      return new ListingDetails({
        ...listingDomain,
        location: listingDomain.country + ', ' + listingDomain.city,
        price: listingDomain.price.toNumber(),
        businessAge: calculateAge(listingDomain.establishedDate).value as any,
        photos: listingDomain.listingImages
          ? listingDomain.listingImages.map((image) =>
            getImageFileLink(image.fileName),
          )
          : [],
        pdfs: listingDomain.listingPdfs
          ? listingDomain.listingPdfs.map((pdf) => getPdfFileLink(pdf.fileName))
          : [],
        annualRevenue: listingDomain.financial
          ? listingDomain.financial.lastYearRevenue
          : null,
        annualSales: listingDomain.financial ? listingDomain.financial.lastYearSales : null,
        annualProfit: listingDomain.financial ? listingDomain.financial.lastYearProfit : null,
        isDebt: listingDomain.financial ? listingDomain.financial.isDebt : null,
        ebitda: listingDomain.financial ? listingDomain.financial.ebitda : null,
        totalDebt: listingDomain.financial ? listingDomain.financial.totalDebt : null,
        ownerId: listingDomain.ownerId,
      } as any);
    } catch (error) {
      throw new Error(error);
    }
  }
}
