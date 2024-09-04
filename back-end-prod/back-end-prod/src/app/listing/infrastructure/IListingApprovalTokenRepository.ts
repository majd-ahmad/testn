import { ListingApprovalTokenDomain } from '../domain/listingApprovalToken.domain';

export interface IListingApprovalTokenRepository {
  getByListingId(listingId: string): Promise<ListingApprovalTokenDomain>;

  addListingToken(
    listingId: string,
    token: string,
  ): Promise<ListingApprovalTokenDomain>;
}

export const IListingApprovalTokenRepositoryToken = Symbol(
  'IListingApprovalTokenRepository',
);
