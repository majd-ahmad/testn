import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  IListingRepository,
  IListingRepositoryToken,
} from '../infrastructure/IListingRepository';
import {
  IUploadService,
  IUploadServiceToken,
} from 'src/libs/file-upload/IUploadService';
import { CreateListingFilesDto } from '../model/ListingFileDto.dto';
import { FilesType } from '../domain/files-type-enum';
import { ListingOverview } from '../model/ListingOverview';
import { DocumentsModel } from '../model/DocumentModale';
import { getImageFileLink, getPdfFileLink } from 'src/utils/FileHelpers';

@Injectable()
export class FilesService {
  constructor(
    @Inject(IListingRepositoryToken)
    readonly listingRepository: IListingRepository,
    @Inject(IUploadServiceToken)
    private readonly uploadService: IUploadService,
  ) {}

  async uploadFilesToBucket(
    files: Express.Multer.File[],
  ): Promise<Express.Multer.File[]> {
    const promises = files.map(async (file) => {
      return await this.uploadService.uploadFile(file);
    });
    return await Promise.all(promises);
  }

  async addFilesToListing(
    listingId: string,
    files: CreateListingFilesDto[],
    filesType: FilesType,
  ): Promise<void> {
    switch (filesType) {
      case FilesType.IMAGE:
        await this.listingRepository.addImages(listingId, files);
        break;
      case FilesType.PDF:
        await this.listingRepository.addPDF(listingId, files);
        break;
    }
  }

  async deleteImage(
    listingId: string,
    fileId: string,
  ): Promise<ListingOverview> {
    try {
      const fileInformation = await this.listingRepository.getImageById(fileId);

      if (fileInformation.listingId !== listingId) {
        throw new Error('File does not belong to this listing');
      }

      const deleteFileFromBucket = await this.uploadService.deleteFile(
        fileInformation.fileName,
      );

      if (deleteFileFromBucket) {
        const updatedListing = await this.listingRepository.deleteFile(
          listingId,
          fileId,
        );
        Logger.log('File deleted successfully');
        return ListingOverview.fromDomain(updatedListing);
      } else {
        throw new Error('Could not delete file from bucket');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async deletePdf(listingId: string, fileId: string): Promise<ListingOverview> {
    try {
      const fileInformation = await this.listingRepository.getPdfById(fileId);

      if (fileInformation.listingId !== listingId) {
        throw new Error('File does not belong to this listing');
      }

      const deleteFileFromBucket = await this.uploadService.deleteFile(
        fileInformation.fileName,
      );

      console.log(deleteFileFromBucket);
      if (deleteFileFromBucket) {
        const updatedListing = await this.listingRepository.deleteFile(
          listingId,
          fileId,
        );
        return ListingOverview.fromDomain(updatedListing);
      } else {
        throw new Error('Could not delete file from bucket');
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFilesByListingId(
    listingId: string,
  ): Promise<{ images: DocumentsModel[]; pdfs: DocumentsModel[] }> {
    try {
      const files = {
        images: [],
        pdfs: [],
      };
      const documents =
        await this.listingRepository.getDocumentsByListingsId(listingId);
      documents.images.map((doc) => {
        files.images.push(
          DocumentsModel.create(doc.id, getImageFileLink(doc.fileName)),
        );
      });
      documents.documents.map((doc) => {
        files.pdfs.push(
          DocumentsModel.create(doc.id, getPdfFileLink(doc.fileName)),
        );
      });
      return files;
    } catch (error) {
      throw new Error(error);
    }
  }
}
