import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BuyerDomain } from 'src/app/account/domain/buyer.domain';
import { InterestedIn } from 'src/app/account/domain/enums/interestedIn.enum';
import { BusinessStage } from 'src/app/listing/domain/enums/businessStage.enum';

export interface IBuyer {
    id: string;
    interestedIn: InterestedIn;
    businessStage: BusinessStage;
    preferredIndustry: string[];
    preferredCountry: string;
    preferredCities: string[];
    aboutBuyer: string;
    aspectsLookedInto: string;
    investmentRange: string;
    preferredTimeFrame?: string;
    accountId: string;
}

export class BuyerModel implements IBuyer {
    @ApiProperty()
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly accountId: string;

    @IsEnum(InterestedIn)
    @ApiProperty({ enum: InterestedIn, example: InterestedIn.BUY_BUSINESS })
    @IsNotEmpty({})
    interestedIn: InterestedIn;

    @IsEnum(BusinessStage)
    @ApiProperty({ enum: BusinessStage, example: BusinessStage.GROWTH })
    businessStage: BusinessStage;

    @IsArray({ message: 'Preferred Industry must be an array of strings' })
    @ApiProperty({ type: String, isArray: true, example: ['IT', 'Finance'] })
    preferredIndustry: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'India' })
    preferredCountry: string;

    @IsArray({ message: 'Preferred Cities must be an array of strings' })
    @ApiProperty({ type: String, isArray: true, example: ['Mumbai', 'Delhi'] })
    preferredCities: string[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    aboutBuyer: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    aspectsLookedInto: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    investmentRange: string;

    @IsOptional()
    @ApiProperty()
    preferredTimeFrame?: string;

    constructor(data: IBuyer) {
        Object.assign(this, data);
    }

    static fromDomain(domain: BuyerDomain): BuyerModel {
        return new BuyerModel({
            ...domain,
        });
    }
}