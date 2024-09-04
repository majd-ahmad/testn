import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IListingRepository,
  IListingRepositoryToken,
} from '../infrastructure/IListingRepository';
import { CreateOrUpdateListingCommand } from '../model/CreateOrUpdateListingCommand.dto';
import { ListingOverview } from '../model/ListingOverview';
import { ListingDetails } from '../model/ListingDetails';
import { MyListingsOverview } from '../model/MyListings';
import { FilterDto } from '../model/FilterDto.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { FilterType } from 'src/utils/types/filter.type';
import { UpdateIsSold } from '../model/UpdateIsSold.dto';
import { ListingModel } from '../model/ListingModel';
import { FinancialModel } from '../model/FinancialModel';
import { AccountService } from '../../account/application/account.service';
import { EVENTS } from '../../../event-emmiter/events';
import {
  IEventEmitters,
  IEVENTEMITTERS,
} from '../../../event-emmiter/IEventEmitters';
import { ListingApprovalTokenService } from './listingApprovalToken.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SellerQnAModel } from '../model/qaSeller/qaSeller.model';
import { AccountDomain } from 'src/app/account/domain/account';
import { GenericMapper } from 'src/utils/GenericMapper';

@Injectable()
export class ListingService {
  constructor(
    @Inject(IListingRepositoryToken)
    readonly listingRepository: IListingRepository,
    private readonly accountService: AccountService,
    private readonly listingApprovalTokenService: ListingApprovalTokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
  ) { }

  async registerListing(
    createListingDto: CreateOrUpdateListingCommand,
  ): Promise<string> {
    try {
      console.log('createListingDto', createListingDto)
      const listingId = await this.listingRepository.createListing(createListingDto);
      console.log('listingId', listingId);
      if (createListingDto?.ownerId) {
        const owner = await this.getListingOwnerId(createListingDto.ownerId)
        console.log('owner', owner)
        this.eventEmitter.emit(EVENTS.BUSINESS_PROFILE_SUBMITTED, {
          email: owner.email,
          name: `${owner?.firstName ?? ""} ${owner?.lastName ?? ""}`,
          businessName: createListingDto.organizationName ?? "",
          businessId: listingId,
        })
      }
      return listingId;
    } catch (error) {
      throw new BadRequestException('Could not init listing', { cause: error });
    }
  }

  async getListings(
    filters: FilterDto,
    lastCursor: string,
  ): Promise<{ totalPage: number; data: ListingOverview[] }> {
    const {
      dealType: deal_type,
      industryType: industry_type,
      city,
      maxPrice,
      minPrice,
      pageNumber,
      pageSize,
      sortedBy = 'createdAt',
      order = 'desc',
    } = filters;

    const queryFilters: FilterType[] = [];
    if (deal_type !== undefined) {
      queryFilters.push({
        filterName: 'dealType',
        value: Array.isArray(deal_type) ? deal_type : [deal_type],
      });
    }
    if (industry_type !== undefined) {
      queryFilters.push({
        filterName: 'industryType',
        value: Array.isArray(industry_type) ? industry_type : [industry_type],
      });
    }
    if (city !== undefined) {
      queryFilters.push({
        filterName: 'city',
        value: Array.isArray(city) ? city : [city],
      });
    }

    const listingsEntities = await this.listingRepository.getAllListings(
      +pageNumber,
      +pageSize,
      sortedBy,
      order,
      queryFilters,
      +maxPrice === -1 ? new Decimal(99999999) : new Decimal(maxPrice),
      new Decimal(minPrice ?? 0),
      lastCursor,
    );

    const listingsOverview = listingsEntities.data.map((listingEntity) =>
      ListingOverview.fromDomain(listingEntity),
    );
    return { totalPage: listingsEntities.totalPage, data: listingsOverview };
  }
  async createSellerQnA(listingId: string, createSellerQnADto: SellerQnAModel): Promise<SellerQnAModel> {
    try {
      return this.listingRepository.createSellerQnA(listingId, createSellerQnADto);
    } catch (error) {
      throw new BadRequestException('Could not create sellerQna', { cause: error });
    }
  }

  async updateSellerQnA(listingId: string, updateSellerQnADto: SellerQnAModel) {
    try {
      return this.listingRepository.updateSellerQnA(listingId, updateSellerQnADto);
    } catch (error) {
      throw new BadRequestException('Could not create sellerQna', { cause: error });
    }
  }

  async getSellerQnAByListingId(listingId: string) {
    try {
      return this.listingRepository.getSellerQnAByListingId(listingId);
    } catch (error) {
      throw new BadRequestException('Could not create sellerQna', { cause: error });
    }
  }
  async getMyListings(
    ownerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{
    totalCount: number;
    totalPage: number;
    data: MyListingsOverview[];
  }> {
    const listingsEntities = await this.listingRepository.getMyListings(
      ownerId,
      pageNumber,
      pageSize,
    );
    const listingsOverview = listingsEntities.data.map((listingEntity) =>
      MyListingsOverview.fromDomain(listingEntity),
    );
    return {
      totalCount: listingsEntities.totalCount,
      totalPage: listingsEntities.totalPage,
      data: listingsOverview,
    };
  }

  async getListingById(listingId: string): Promise<ListingDetails> {
    try {
      const listingEntity = await this.listingRepository.getListingById(listingId);
      console.log('listingEntity', listingEntity);
      return ListingDetails.fromDomain(listingEntity);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getListingBusinessById(listingId: string): Promise<ListingModel> {
    const listingEntity =
      await this.listingRepository.getListingById(listingId);
    return ListingModel.fromDomain(listingEntity);
  }

  async getLatestListings(
    numberOfListings: number,
  ): Promise<ListingOverview[]> {
    try {
      const listingsEntities =
        await this.listingRepository.getLatestListings(numberOfListings);
      const listingsOverview = listingsEntities.map((listingEntity) =>
        ListingOverview.fromDomain(listingEntity),
      );
      return listingsOverview;
    } catch (error) {
      console.log(error);
    }
  }

  async updateIsApproved(
    listingId: string,
    isApproved: boolean,
    rejectionReason: string,
  ): Promise<ListingOverview> {
    try {
      const listingEntity = await this.listingRepository.updateIsApproved(
        listingId,
        isApproved,
        rejectionReason
      );
      return ListingOverview.fromDomain(listingEntity);
    } catch (error) {
      console.log(error);
    }
  }

  async updateIsSold(
    listingId: string,
    updateIsSoldDto: UpdateIsSold,
  ): Promise<void> {
    try {
      const listing = await this.listingRepository.updateIsSold(
        listingId,
        updateIsSoldDto.isSold,
      );
      ListingDetails.fromDomain(listing);
    } catch (error) {
      console.log(error);
    }
  }

  async updateListing(
    listingId: string,
    updateListingDto: CreateOrUpdateListingCommand,
  ): Promise<ListingModel> {
    try {
      const listing = await this.listingRepository.updateListing(
        listingId,
        updateListingDto,
      );
      return ListingModel.fromDomain(listing);
    } catch (error) {
      console.log(error);
    }
  }

  async getFinancialByListingId(listingId: string): Promise<FinancialModel> {
    try {
      const financial =
        await this.listingRepository.getFinancialByListingId(listingId);
      return FinancialModel.fromDomain(financial);
    } catch (error) {
      console.log(error);
    }
  }

  async contactListingOwner(currentUserId: string, listingId: string) {
    try {
      const currentUser =
        await this.accountService.findAccountById(currentUserId);
      const listing = await this.getListingById(listingId);
      const owner = await this.accountService.getAccountById(listing.ownerId);
      this.eventEmitter.emit(EVENTS.SELLER_CONTACT, {
        email: currentUser.email,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        owner: owner,
        listing: listing,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getListingOwnerId(ownerId: string): Promise<AccountDomain> {
    const owner = await this.accountService.getAccountById(ownerId);
    if (owner) {
      return GenericMapper.mapPrismaEntityToDomain(owner, AccountDomain)
    }
    return null
  }

  async sendForApproval(listingId: string) {
    console.log('sendForApproval listingId', listingId)
    const listing = await this.getListingById(listingId);
    console.log('listing', listing)
    const hash = await this.jwtService.signAsync(
      {
        listingId: listingId,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
    console.log('hash', hash)
    const listingApprovalToken =
      await this.listingApprovalTokenService.createListingApprovalToken(
        listingId,
        hash,
      );
      console.log('listingApprovalToken', listingApprovalToken)
    this.eventEmitter.emit(EVENTS.SEND_FOR_APPROVAL, {
      email: process.env.MAIL_USER,
      listing: listing,
      token: listingApprovalToken.token,
    });
  }

  async verifyApprovalToken(listingId: string, token: string) {
    const listingApprovalToken =
      await this.listingApprovalTokenService.getByListingId(listingId);
    return listingApprovalToken.token == token;
  }
}
