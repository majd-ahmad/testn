import { IListingApprovalTokenRepository } from './IListingApprovalTokenRepository';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../database/database.service';
import { ListingApprovalTokenDomain } from '../domain/listingApprovalToken.domain';

@Injectable()
export class ListingApprovalTokenRepository
  implements IListingApprovalTokenRepository
{
  constructor(private db: DatabaseService) {}

  async getByListingId(listingId: string): Promise<ListingApprovalTokenDomain> {
    const listingApprovalTokenEntity =
      await this.db.listingApprovalToken.findUnique({
        where: { listingId: listingId },
      });
    return listingApprovalTokenEntity as ListingApprovalTokenDomain;
  }

  async addListingToken(
    listingId: string,
    token: string,
  ): Promise<ListingApprovalTokenDomain> {
    return (await this.db.listingApprovalToken.create({
      data: { listingId: listingId, token: token },
    })) as ListingApprovalTokenDomain;
  }
}
