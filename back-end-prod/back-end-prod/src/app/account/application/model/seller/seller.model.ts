import { ApiProperty } from '@nestjs/swagger';
import { SellerDomain } from 'src/app/account/domain/seller.domain';

export interface ISeller {
    id: string;
    accountId: string;
}
export class SellerModel implements ISeller {
    @ApiProperty()
    readonly id: string;
    @ApiProperty()
    readonly accountId: string;

    constructor(data: ISeller) {
        Object.assign(this, data);
    }

    static fromDomain(domain: SellerDomain): SellerModel {
        return new SellerModel({
            ...domain,
        });
    }
}