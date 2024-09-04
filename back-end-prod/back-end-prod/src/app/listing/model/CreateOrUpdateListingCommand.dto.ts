import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { DealType } from '../domain/enums/dealType.enum';
import { Industry } from '../domain/enums/industryType.enum';
import { BusinessStage } from '../domain/enums/businessStage.enum';
import { EntityType } from '../domain/enums/entityType.enum';
import { IListing } from './ListingModel';

export class CreateOrUpdateListingCommand implements IListing {
  @IsOptional()
  id: string
  @IsOptional()
  location: string
  @IsString()
  @IsOptional()
  @ApiProperty()
  ownerId?: string | null;

  @IsString({ message: 'Enter organization Name' })
  @IsNotEmpty({ message: 'Enter organization Name' })
  @Length(3, 30, { message: 'Enter organization Name that is between 3 and 30 characters long' })
  @ApiProperty()
  organizationName: string | null;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  aboutBusiness: string;
  @IsOptional()
  @ApiProperty()
  assetOverview: string | null;
  @IsEnum(DealType, { message: 'Select Deal Type' })
  @IsNotEmpty()
  @ApiProperty()
  dealType: DealType | null;

  @IsBoolean()
  @IsNotEmpty({ message: 'Enter Is Startup' })
  @ApiProperty()
  isStartup: boolean | null;

  @IsEnum(Industry, { message: 'Select Industry' })
  @IsNotEmpty({ message: 'Enter Industry Type name' })
  @ApiProperty()
  industryType: Industry | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  country: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  establishedDate: Date | null;

  @IsOptional()
  establishmentDate: Date | null
  @IsOptional()
  businessAge: string[] | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  businessOverview: string | null;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  price: any;

  @IsEnum(BusinessStage, { message: 'Select Business Stage' })
  @IsNotEmpty({ message: 'Select Business Stage' })
  @ApiProperty({ enum: BusinessStage, description: 'Business Stage: Select the current stage of your business. This helps us understand where you are in your business journey' })
  businessStage: BusinessStage | null;

  @IsEnum(EntityType, { message: 'Select Entity Type' })
  @IsNotEmpty({ message: 'Select Entity Type' })
  @ApiProperty({ enum: EntityType })
  entityType: EntityType | null;

  @IsDate()
  @IsOptional()
  @ApiProperty()
  createdAt?: Date | null;
}
