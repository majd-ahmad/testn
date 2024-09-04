import { ListingDomain } from '../domain/listing.domain';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DealType } from '../domain/enums/dealType.enum';
import { Industry } from '../domain/enums/industryType.enum';
import { BusinessStage } from '../domain/enums/businessStage.enum';
import { EntityType } from '../domain/enums/entityType.enum';
import { enumToArray } from 'src/utils/EnumHelpers';
import { SellerQnAModel } from './qaSeller/qaSeller.model';

export interface IListing {
  id: string;
  organizationName: string | null;
  aboutBusiness: string;
  assetOverview: string | null;
  location: string | null;
  country: string | null;
  city: string | null;
  establishedDate: Date | null;
  price: any;
  industryType: Industry | null;
  establishmentDate: Date;
  businessAge: string[];
  dealType: DealType | null;
  businessOverview: string;
  isStartup: boolean;
  ownerId?: string | null;
  rejectionReason?: string | null;
  businessStage: BusinessStage | null;
  entityType: EntityType | null;
}

export class ListingModel implements IListing {
  @IsString()
  @ApiProperty()
  id: string;

  @IsString()
  @ApiProperty()
  organizationName: string | null;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  aboutBusiness: string;
  @IsOptional()
  @ApiProperty()
  assetOverview: string | null;
  @IsString()
  @ApiProperty()
  location: string | null;

  @IsString()
  @ApiProperty()
  country: string | null;

  @IsString()
  @ApiProperty()
  city: string | null;

  @IsOptional()
  @ApiProperty()
  rejectionReason: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  establishedDate: Date | null;

  @IsNumber()
  @ApiProperty()
  price: number | null;

  @IsEnum(Industry)
  @IsNotEmpty()
  @ApiProperty()
  industryType: Industry | null;

  @IsDate()
  @ApiProperty()
  establishmentDate: Date;

  @IsArray()
  @ApiProperty()
  businessAge: string[];

  @IsEnum(DealType)
  @IsNotEmpty()
  @ApiProperty()
  dealType: DealType | null;

  @IsString()
  @ApiProperty()
  businessOverview: string;

  @IsBoolean()
  @ApiProperty()
  isStartup: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty()
  ownerId?: string | null;

  @IsEnum(BusinessStage, { message: `Business stage should be in : ${enumToArray(BusinessStage)}` })
  @IsNotEmpty({ message: `Business stage is required` })
  @ApiProperty({ enum: BusinessStage })
  businessStage: BusinessStage | null;

  @IsEnum(EntityType)
  @IsNotEmpty()
  @ApiProperty({ enum: EntityType })
  entityType: EntityType | null;

  @IsOptional()
  @ApiProperty({ type: SellerQnAModel })
  qaSeller: SellerQnAModel

  constructor(data: IListing) {
    Object.assign(this, data);
  }

  static fromDomain(listingDomain: ListingDomain): ListingModel {
    return new ListingModel({
      ...listingDomain,
      location: `${listingDomain.country}, ${listingDomain.city}`,
      price: listingDomain.price.toNumber(),
      establishmentDate: new Date(
        listingDomain.establishedDate.getFullYear(),
        listingDomain.establishedDate.getMonth() - 1,
        listingDomain.establishedDate.getDate(),
      )
    });
  }
}
