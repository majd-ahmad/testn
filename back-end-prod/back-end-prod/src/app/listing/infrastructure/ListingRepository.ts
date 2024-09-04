import { BadRequestException, Injectable } from '@nestjs/common';
import { IListingRepository } from './IListingRepository';
import { ListingDomain } from '../domain/listing.domain';
import { DatabaseService } from 'src/database/database.service';
import { GenericMapper } from 'src/utils/GenericMapper';
import { CreateOrUpdateListingCommand } from '../model/CreateOrUpdateListingCommand.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { CreateOrUpdateFinancialCommand } from '../model/CreateOrUpdateFinancialsCommand.dto';
import { CreateListingFilesDto } from '../model/ListingFileDto.dto';
import { FilterType } from 'src/utils/types/filter.type';
import { FinancialDomain } from '../domain/financial.domain';
import { ListingImagesDomain, ListingPdfDomain } from '../domain/files.domain';
import { PreviousYearModel, PreviousYearType } from '../model/previousYear/previousYear.model';
import { PreviousYearDomain } from '../domain/previousYears.domain';
import { SellerQnAModel } from '../model/qaSeller/qaSeller.model';

@Injectable()
export class ListingRepository implements IListingRepository {
  constructor(private db: DatabaseService) { }

  async getMyListings(
    ownerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<{ totalCount: number; totalPage: number; data: ListingDomain[] }> {
    try {
      const skip =
        pageNumber === -1 || pageNumber === 1 ? 0 : (pageNumber - 1) * pageSize;
      const take =
        pageSize === -1
          ? await this.db.listing.count({
            where: {
              ownerId: ownerId,
            },
          })
          : pageSize;
      const [count, data] = await this.db.$transaction([
        this.db.listing.count({
          where: {
            ownerId: ownerId,
          },
        }),

        this.db.listing.findMany({
          where: {
            ownerId: ownerId,
          },
          skip: skip,
          take: take,
          orderBy: [
            {
              ['createdAt']: 'desc',
            },
          ],

          include: {
            financial: true,
            listingImages: true,
          },
        }),
      ]);

      return {
        totalCount: count,
        totalPage: Math.ceil(count / take),
        data: data.map((listing) =>
          GenericMapper.mapPrismaEntityToDomain(listing, ListingDomain),
        ),
      };
    } catch (error) {
      throw new BadRequestException('Cannot fetch', { cause: error });
    }
  }
  async addImages(
    listingId: string,
    files: CreateListingFilesDto[],
  ): Promise<ListingDomain> {
    if (files.length === 0) {
      return await this.getListingById(listingId);
    }

    const imagesToSave = files.map((file: CreateListingFilesDto) => ({
      listingId: listingId,
      ...file,
    }));

    console.log('imagesToSave', imagesToSave);

    await this.db.listingPhoto.createMany({
      data: imagesToSave,
    });

    const findPhotos = await this.db.listingPhoto.findMany({
      where: {
        listingId: listingId,
      },
    });
    console.log('fetchedImages', imagesToSave);

    const listing = await this.db.listing.update({
      where: { id: listingId },
      data: {
        listingImages: {
          connect: findPhotos.map((image) => ({ id: image.id })),
        },
      },
      include: {
        listingImages: true,
      },
    });

    return GenericMapper.mapPrismaEntityToDomain(listing, ListingDomain);
  }

  async addPDF(
    listingId: string,
    files: CreateListingFilesDto[],
  ): Promise<ListingDomain> {
    if (files.length === 0) {
      return await this.getListingById(listingId);
    }

    const documentsToSave = files.map((file: CreateListingFilesDto) => ({
      listingId: listingId,
      ...file,
    }));

    await this.db.listingPdf.createMany({
      data: documentsToSave,
    });

    const fetchedPdfs = await this.db.listingPdf.findMany({
      where: {
        listingId: listingId,
      },
    });

    const listing = await this.db.listing.update({
      where: { id: listingId },
      data: {
        listingPdfs: {
          connect: fetchedPdfs.map((pdf) => ({ id: pdf.id })),
        },
      },
      include: {
        listingPdfs: true,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(listing, ListingDomain);
  }
  async getListingById(listingId: string): Promise<ListingDomain> {
    const listingEntity = await this.db.listing.findUnique({
      where: { id: listingId },
      include: {
        financial: true,
        listingImages: true,
        listingPdfs: true,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(listingEntity, ListingDomain);
  }

  async addFinancial(
    listingId: string,
    financial: CreateOrUpdateFinancialCommand,
  ): Promise<FinancialDomain> {
    const savedFinancial = await this.db.financial.create({
      data: { listingId: listingId, ...financial },
    });

    return GenericMapper.mapPrismaEntityToDomain(
      savedFinancial,
      FinancialDomain,
    );
  }

  addFiles(
    listingId: string,
    imageIds?: string[],
    pdfIds?: string[],
  ): Promise<ListingDomain> {
    console.log(listingId, imageIds, pdfIds);
    throw new Error('addFiles: Method not implemented.');
  }

  async getLatestListings(numberOfListings: number): Promise<ListingDomain[]> {
    const listings = await this.db.listing.findMany({
      take: numberOfListings,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      include: {
        financial: true,
        listingImages: true,
      },
    });
    const mappedData = listings.map((listing) =>
      GenericMapper.mapPrismaEntityToDomain(listing, ListingDomain),
    );
    return mappedData;
  }

  async getAllListings(
    pageNumber: number,
    pageSize: number,
    sortedBy: string,
    order: string,
    filters?: FilterType[],
    maxPrice?: Decimal,
    minPrice?: Decimal,
    lastCursor?: string,
  ): Promise<{ totalPage: number; data: ListingDomain[] }> {
    try {
      const queryFilters: Array<any> = filters.map((filter: FilterType) => ({
        [filter.filterName]: {
          in: filter.value,
        },
      }));
      let sortedWith;
      if (sortedBy === 'createdAt') {
        sortedWith = {
          createdAt: 'desc',
        };
      } else {
        sortedWith =
          sortedBy === 'title' || sortedBy === 'price'
            ? [
              {
                [sortedBy]: order,
              },
            ]
            : [
              {
                financial: {
                  [sortedBy]: order,
                },
              },
            ];
      }

      const wheres = {
        AND: queryFilters,
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      };

      const take =
        pageSize === -1
          ? await this.db.listing.count({
            where: wheres,
          })
          : pageSize;

      const cursor =
        pageNumber === 1 && lastCursor ? { id: lastCursor } : undefined;

      const [count, data] = await this.db.$transaction([
        this.db.listing.count({ where: wheres }),
        this.db.listing.findMany({
          where: wheres,

          skip: pageNumber > 1 && lastCursor ? 1 : 0,
          cursor: cursor,
          take: take,
          orderBy: sortedWith,
          include: {
            financial: true,
            listingImages: true,
          },
        }),
      ]);
      const mappedData = data.map((listing) =>
        GenericMapper.mapPrismaEntityToDomain(listing, ListingDomain),
      );
      return {
        totalPage: Math.ceil(count / take),
        data: mappedData,
      };
    } catch (error) {
      throw new BadRequestException('Cannot fetch', { cause: error });
    }
  }

  async createListing(
    createListingDto: CreateOrUpdateListingCommand,
  ): Promise<string> {
    try {
      const createdListing = await this.db.listing.create({
        data: {
          isApproved: false,
          ownerId: createListingDto.ownerId,
          price: new Decimal(createListingDto.price),
          title:
            createListingDto.industryType +
            ' business for Sale in ' +
            createListingDto.city,
          ...createListingDto,
        },
      });
      return createdListing.id;
    } catch (error) {
      throw new Error(`creating listing ${error}`, { cause: error.stack });
    }
  }
  async createSellerQnA(
    listingId: string,
    createSellerQnADto: SellerQnAModel
  ): Promise<SellerQnAModel> {
    try {
      const createdSellerQnA = await this.db.sellerQnA.create({
        data: {
          ...createSellerQnADto,
          listingId,
        },
      });
      return createdSellerQnA;
    } catch (error) {
      throw new Error(`creating sellerQnA ${error}`, { cause: error.stack });
    }
  }
  async updateSellerQnA(
    listingId: string,
    updateSellerQnADto: SellerQnAModel
  ): Promise<SellerQnAModel> {
    try {
      const updatedSellerQnA = await this.db.sellerQnA.update({
        where: { listingId },
        data: {
          ...updateSellerQnADto,
        },
      });
      return updatedSellerQnA;
    } catch (error) {
      throw new Error(`updating sellerQnA ${error}`, { cause: error.stack });
    }
  }
  async getSellerQnAByListingId(
    listingId: string,
  ): Promise<SellerQnAModel> {
    try {
      const sellerQnA = await this.db.sellerQnA.findUnique({
        where: { listingId },
      });
      return sellerQnA;
    } catch (error) {
      throw new Error(`geting sellerQnA ${error}`, { cause: error.stack });
    }
  }

  async updateIsSold(
    listingId: string,
    isSold: boolean,
  ): Promise<ListingDomain> {
    const updatedListing = await this.db.listing.update({
      where: {
        id: listingId,
      },
      data: {
        isSold: isSold,
      },
      include: {
        financial: true,
        listingImages: true,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(updatedListing, ListingDomain);
  }

  async updateIsApproved(
    listingId: string,
    isApproved: boolean,
    rejectionReason: string,
  ): Promise<ListingDomain> {
    const updatedListing = await this.db.listing.update({
      where: {
        id: listingId,
      },
      data: {
        isApproved: isApproved,
        rejectionReason: rejectionReason ?? "",
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(updatedListing, ListingDomain);
  }

  async deleteFile(listingId: string, fileId: string): Promise<ListingDomain> {
    await this.db.listingPhoto.delete({
      where: { id: fileId, listingId: listingId },
    });
    const updatedListing = await this.getListingById(listingId);
    return GenericMapper.mapPrismaEntityToDomain(updatedListing, ListingDomain);
  }

  async deleteFinancial(listingId: string): Promise<ListingDomain> {
    this.db.financial.delete({
      where: { listingId: listingId },
    });
    const updatedListing = await this.getListingById(listingId);
    return GenericMapper.mapPrismaEntityToDomain(updatedListing, ListingDomain);
  }

  async deleteListing(listingId: string): Promise<void> {
    this.db.listing.delete({
      where: { id: listingId },
    });
  }

  async updateListing(
    listingId: string,
    updateListingDto: CreateOrUpdateListingCommand,
  ): Promise<ListingDomain> {
    const updatedListing = await this.db.listing.update({
      where: { id: listingId },
      data: {
        ...updateListingDto,
        organizationName: updateListingDto.organizationName,
        isStartup: updateListingDto.isStartup,
      },
      include: {
        financial: true,
        listingImages: true,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(updatedListing, ListingDomain);
  }
  async updateFinancial(
    listingId: string,
    financial: CreateOrUpdateFinancialCommand,
  ): Promise<FinancialDomain> {
    const financialUpdated = await this.db.financial.update({
      where: { listingId: listingId },
      data: {
        ...financial,
      },
    });
    return GenericMapper.mapPrismaEntityToDomain(
      financialUpdated,
      FinancialDomain,
    );
  }
  async updateFinancialPreviousYearByType(data: {
    financialId: string,
    type: PreviousYearType,
    previousYears: PreviousYearModel[],
  }): Promise<void> {
    const foundPreviousYears = await this.db.previousYearValues.findMany({
      where: { financialId: data.financialId, type: data.type },
    });

    // Ensure that all previous years from data.previousYears exist in the database
    for (const doc of data.previousYears) {
      const yearExistsInDatabase = foundPreviousYears.some(foundYear => foundYear.id === doc.id);
      if (yearExistsInDatabase) {
        // Update the year in the database if it exists
        await this.db.previousYearValues.update({
          where: { id: doc.id },
          data: {
            value: doc.value,
            year: doc.year,
          },
        });
      } else {
        // Create the year in the database if it doesn't exist
        await this.db.previousYearValues.create({
          data: {
            id: doc.id,
            financialId: data.financialId,
            type: data.type,
            value: doc.value,
            year: doc.year,
          },
        });
      }
    }

    // Delete any previous years from the database that don't exist in data.previousYears
    for (const foundYear of foundPreviousYears) {
      const yearExistsInData = data.previousYears.some(year => year.id === foundYear.id);
      if (!yearExistsInData) {
        // Delete the found previous year from the database
        await this.db.previousYearValues.delete({
          where: { id: foundYear.id },
        });
      }
    }
  }

  async getFinancialPreviousYearsByType(financialId: string, type: PreviousYearType): Promise<PreviousYearModel[]> {
    const previousYears = await this.db.previousYearValues.findMany({
      where: { financialId, type },
    });
    return previousYears.map(year => GenericMapper.mapPrismaEntityToDomain(year, PreviousYearDomain))
  }

  async getFinancialByListingId(listingId: string): Promise<FinancialDomain> {
    const financial = await this.db.financial.findUnique({
      where: { listingId: listingId },
    });

    return GenericMapper.mapPrismaEntityToDomain(financial, FinancialDomain);
  }

  async getImageById(fileId: string): Promise<ListingImagesDomain> {
    const listingImage = await this.db.listingPhoto.findUnique({
      where: { id: fileId },
    });
    return GenericMapper.mapPrismaEntityToDomain(
      listingImage,
      ListingImagesDomain,
    );
  }

  async getPdfById(fileId: string): Promise<ListingPdfDomain> {
    const listingPdf = await this.db.listingPdf.findUnique({
      where: { id: fileId },
    });
    return GenericMapper.mapPrismaEntityToDomain(listingPdf, ListingPdfDomain);
  }

  async getDocumentsByListingsId(
    listingId: string,
  ): Promise<{ images: ListingImagesDomain[]; documents: ListingPdfDomain[] }> {
    const listingPdf = await this.db.listingPdf.findMany({
      where: { listingId: listingId },
    });
    const listingImage = await this.db.listingPhoto.findMany({
      where: { listingId: listingId },
    });
    return {
      images: listingImage.map((image) =>
        GenericMapper.mapPrismaEntityToDomain(image, ListingImagesDomain),
      ),
      documents: listingPdf.map((pdf) =>
        GenericMapper.mapPrismaEntityToDomain(pdf, ListingPdfDomain),
      ),
    };
  }
}
