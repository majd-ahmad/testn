import { ListingDomain } from '../domain/listing.domain';
import { CreateOrUpdateListingCommand } from '../model/CreateOrUpdateListingCommand.dto';
import { CreateOrUpdateFinancialCommand } from '../model/CreateOrUpdateFinancialsCommand.dto';
import { CreateListingFilesDto as CreateListingFilesDto } from '../model/ListingFileDto.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { FilterType } from 'src/utils/types/filter.type';
import { FinancialDomain } from '../domain/financial.domain';
import { ListingImagesDomain, ListingPdfDomain } from '../domain/files.domain';
import { PreviousYearModel, PreviousYearType } from '../model/previousYear/previousYear.model';
import { SellerQnAModel } from '../model/qaSeller/qaSeller.model';

export interface IListingRepository {
  getAllListings(
    pageNumber: number,
    pageSize: number,
    sortedBy: string,
    order: string,
    filters?: FilterType[],
    maxPrice?: Decimal,
    minPrice?: Decimal,
    lastCursor?: string,
  ): Promise<{ totalPage: number; data: ListingDomain[] }>;

  getLatestListings(numberOfListings: number): Promise<ListingDomain[]>;

  addImages(
    listingId: string,
    files: CreateListingFilesDto[],
  ): Promise<ListingDomain>;
  addPDF(
    listingId: string,
    files: CreateListingFilesDto[],
  ): Promise<ListingDomain>;

  getListingById(listingId: string): Promise<ListingDomain>;

  getMyListings(
    ownerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ totalCount: number; totalPage: number; data: ListingDomain[] }>;

  createListing(
    createListingCommand: CreateOrUpdateListingCommand,
  ): Promise<string>;

  updateIsSold(listingId: string, isSold: boolean): Promise<ListingDomain>;

  updateIsApproved(
    listingId: string,
    isApproved: boolean,
    rejectionReason: string,
  ): Promise<ListingDomain>;
  createSellerQnA(listingId: string, createSellerQnADto: SellerQnAModel): Promise<SellerQnAModel>;
  updateSellerQnA(listingId: string, updateSellerQnADto: SellerQnAModel): Promise<SellerQnAModel>;
  getSellerQnAByListingId(listingId: string): Promise<SellerQnAModel>;

  updateListing(
    listingId: string,
    updateListingDto: CreateOrUpdateListingCommand,
  ): Promise<ListingDomain>;

  addFinancial(
    listingId: string,
    financial: CreateOrUpdateFinancialCommand,
  ): Promise<FinancialDomain>;
  getFinancialByListingId(listingId: string): Promise<FinancialDomain>;
  updateFinancial(
    listingId: string,
    financial: CreateOrUpdateFinancialCommand,
  ): Promise<FinancialDomain>;

  updateFinancialPreviousYearByType(data: {
    financialId: string,
    type: PreviousYearType,
    previousYears: PreviousYearModel[],
  }
  )
  getFinancialPreviousYearsByType(financialId: string, type: PreviousYearType): Promise<PreviousYearModel[]>
  deleteFinancial(listingId: string): Promise<ListingDomain>;

  deleteFile(listingId: string, fileId: string): Promise<ListingDomain>;
  deleteListing(listingId: string): Promise<void>;

  getImageById(fileId: string): Promise<ListingImagesDomain>;
  getPdfById(fileId: string): Promise<ListingPdfDomain>;

  getDocumentsByListingsId(
    listingId: string,
  ): Promise<{ images: ListingImagesDomain[]; documents: ListingPdfDomain[] }>;
}

export const IListingRepositoryToken = Symbol('IListingRepository');
