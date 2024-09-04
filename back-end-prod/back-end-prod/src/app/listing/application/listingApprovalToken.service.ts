import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IListingApprovalTokenRepository,
  IListingApprovalTokenRepositoryToken,
} from '../infrastructure/IListingApprovalTokenRepository';
import { ListingApprovalTokenModel } from '../model/ListingApprovalToken';

@Injectable()
export class ListingApprovalTokenService {
  constructor(
    @Inject(IListingApprovalTokenRepositoryToken)
    readonly listingApprovalTokenRepository: IListingApprovalTokenRepository,
  ) {}

  async createListingApprovalToken(
    listingId: string,
    token: string,
  ): Promise<ListingApprovalTokenModel> {
    try {
      console.log('createListingApprovalToken');
      return await this.listingApprovalTokenRepository.addListingToken(
        listingId,
        token,
      );
    } catch (error) {
      throw new BadRequestException('Could not create listing approval token', {
        cause: error,
      });
    }
  }

  async getByListingId(listingId: string): Promise<ListingApprovalTokenModel> {
    try {
      return await this.listingApprovalTokenRepository.getByListingId(
        listingId,
      );
    } catch (error) {
      throw new BadRequestException('Could not get listing approval token', {
        cause: error,
      });
    }
  }
}
