import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';
import { ListingDomain } from '../domain/listing.domain';
import { ApiProperty } from '@nestjs/swagger';
import { getImageFileLink } from 'src/utils/FileHelpers';

export class ListingOverview {
  @IsString()
  @ApiProperty()
  id: string;
  @IsString()
  @ApiProperty()
  image: string | null;
  @IsString()
  @ApiProperty()
  title: string | null;
  @IsString()
  @ApiProperty()
  location: string | null;
  @IsString()
  @ApiProperty()
  city: string | null;
  @IsString()
  @ApiProperty()
  country: string | null;
  @IsString()
  @ApiProperty()
  dealType: string | null;
  @IsString()
  @ApiProperty()
  industryType: string | null;
  @IsNumber()
  @ApiProperty()
  annualRevenue: number | null;
  @IsNumber()
  @ApiProperty()
  annualNetProfit: number | null;
  @IsNumber()
  @ApiProperty()
  price: number | null;
  @IsBoolean()
  @ApiProperty()
  isStartup: boolean | null;
  @IsDate()
  @ApiProperty()
  createdAt: Date;
  @IsString()
  @ApiProperty()
  ownerId: string;

  constructor(
    id: string,
    image: string,
    title: string,
    location: string,
    city: string,
    country: string,
    deal_type: string,
    industryType: string,
    annualRevenue: number,
    annualNetProfit: number,
    price: number,
    isStartup: boolean,
    createdAt: Date,
    ownerId: string,
  ) {
    this.id = id;
    this.image = image;
    this.title = title;
    this.location = location;
    this.city = city;
    this.country = country;
    this.dealType = deal_type;
    this.industryType = industryType;
    this.annualRevenue = annualRevenue;
    this.annualNetProfit = annualNetProfit;
    this.price = price;
    this.isStartup = isStartup;
    this.createdAt = createdAt;
    this.ownerId = ownerId;
  }

  static fromDomain(listingDomain: ListingDomain): ListingOverview {
    try {
      return new ListingOverview(
        listingDomain.id,
        listingDomain.listingImages
          ? listingDomain.listingImages.map((image) =>
              getImageFileLink(image.fileName),
            )[0]
          : null,
        listingDomain.industryType +
          ' business for Sale in ' +
          listingDomain.city ?? null,

        listingDomain.country + ', ' + listingDomain.city ?? null,
        listingDomain.city ?? null,
        listingDomain.country ?? null,
        listingDomain.dealType ?? null,
        listingDomain.industryType ?? null,
        listingDomain.financial
          ? listingDomain.financial.lastYearRevenue ?? null
          : null,
        listingDomain.financial
          ? listingDomain.financial.lastYearProfit ?? null
          : null,
        listingDomain.price.toNumber() ?? null,
        listingDomain.isStartup,
        listingDomain.createdAt,
        listingDomain.ownerId,
      );
    } catch (error) {
      throw new Error('Cannot map domain to overview', { cause: error });
    }
  }
}
