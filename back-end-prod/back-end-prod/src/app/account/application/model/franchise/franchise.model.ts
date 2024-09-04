import { ApiProperty } from '@nestjs/swagger';
import { FranchiseDomain } from 'src/app/account/domain/franchise.domain';

export interface IFranchise {
    id: string;
    accountId: string;
}
export class FranchiseModel implements IFranchise {
    @ApiProperty()
    readonly id: string;
    @ApiProperty()
    readonly accountId: string;

    constructor(data: IFranchise) {
        Object.assign(this, data);
    }

    static fromDomain(domain: FranchiseDomain): FranchiseModel {
        return new FranchiseModel({
            ...domain,
        });
    }
}