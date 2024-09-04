import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ListingService } from './application/listing.service';
import { ListingOverview } from './model/ListingOverview';
import { CreateOrUpdateListingCommand } from './model/CreateOrUpdateListingCommand.dto';
import { CreateOrUpdateFinancialCommand } from './model/CreateOrUpdateFinancialsCommand.dto';
import { ListingDetails } from './model/ListingDetails';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { validate } from 'class-validator';
import {
  CreateImageFileDto,
  CreatePdfFileDto,
} from './model/CreateFileDto.dto';
import { CreateListingFilesDto } from './model/ListingFileDto.dto';
import { FilesType } from './domain/files-type-enum';
import { v4 as uuidv4 } from 'uuid';
import { FilterDto } from './model/FilterDto.dto';
import { UpdateIsSold } from './model/UpdateIsSold.dto';
import { FilesService } from './application/files.service';
import { FinancialService } from './application/financial.service';
import { ListingModel } from './model/ListingModel';
import { UpdateFinancialModal } from './model/UpdateFinancialModal';
import { FinancialModel } from './model/FinancialModel';
import { MyListingsOverview } from './model/MyListings';
import { CheckUserValidityInterceptor } from '../../interceptors/check-user-validity.interceptor';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ValidateImageFiles } from 'src/decorators/validate-files.decorator';
import { PreviousYearModel, PreviousYearType } from './model/previousYear/previousYear.model';
import { SellerQnAModel } from './model/qaSeller/qaSeller.model';
import { IEVENTEMITTERS, IEventEmitters } from 'src/event-emmiter/IEventEmitters';
import { EVENTS } from 'src/event-emmiter/events';

@ApiTags('Listings')
@Controller('listings')
export class ListingController {
  constructor(
    @Inject(IEVENTEMITTERS) private readonly eventEmitter: IEventEmitters,
    readonly listingService: ListingService,
    readonly fileService: FilesService,
    readonly financialService: FinancialService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  @Get()
  @UseInterceptors(CheckUserValidityInterceptor)
  @ApiOkResponse({ type: ListingOverview, isArray: true })
  async fetchListings(
    @Query()
    filters: FilterDto,
  ): Promise<{ totalPages: number; data: ListingOverview[] }> {
    try {
      const listings = await this.listingService.getListings(
        filters,
        filters.lastCursor,
      );
      return {
        totalPages: listings.totalPage,
        data: listings.data,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Cannot fetch', { cause: error });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post()
  @ApiCreatedResponse({ type: ListingOverview })
  async registerListing(
    @Body() createListingDto: CreateOrUpdateListingCommand,
  ): Promise<string> {
    try {
      return await this.listingService.registerListing(createListingDto);
    } catch (error) {
      throw new BadRequestException('Cannot register listing', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('seller-qna/:id')
  @ApiCreatedResponse({ type: SellerQnAModel })
  async createSellerQnA(
    @Param('id') listingId: string,
    @Body() createSellerQnADto: SellerQnAModel,
  ): Promise<SellerQnAModel> {
    try {
      return await this.listingService.createSellerQnA(listingId, createSellerQnADto);
    } catch (error) {
      throw new BadRequestException('Cannot create Seller Q&A', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Put('seller-qna/:id')
  @ApiOkResponse({ type: SellerQnAModel })
  async updateSellerQnA(
    @Param('id') listingId: string,
    @Body() updateSellerQnADto: SellerQnAModel,
  ): Promise<SellerQnAModel> {
    try {
      return await this.listingService.updateSellerQnA(listingId, updateSellerQnADto);
    } catch (error) {
      throw new BadRequestException('Cannot update Seller Q&A', {
        cause: error,
      });
    }
  }
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Get('seller-qna/:id')
  @ApiOkResponse({ type: SellerQnAModel })
  async getSellerQnAByListingId(@Param('id') listingId: string): Promise<SellerQnAModel> {
    try {
      return await this.listingService.getSellerQnAByListingId(listingId);
    } catch (error) {
      throw new BadRequestException('Cannot retrieve Seller Q&A', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('financial/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiCreatedResponse({ type: ListingOverview })
  async addFinancial(
    @Param() param: { listingId: string },
    @Body() createFinancialDto: CreateOrUpdateFinancialCommand,
  ): Promise<FinancialModel> {
    try {
      return await this.financialService.addFinancialInformation(
        param.listingId,
        createFinancialDto,
      );
    } catch (error) {
      throw new BadRequestException('Cannot add financial to listing', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Get('/mylistings')
  @ApiQuery({ name: 'pageSize', type: 'string' })
  @ApiQuery({ name: 'pageNumber', type: 'string' })
  async getMyListings(
    @CurrentUser() currentUser,
    @Query()
    { pageNumber, pageSize }: { pageNumber: string; pageSize: string },
  ): Promise<{
    totalCount: number;
    totalPages: number;
    data: MyListingsOverview[];
  }> {
    try {
      const { totalPage, totalCount, data } =
        await this.listingService.getMyListings(
          currentUser.id,
          +pageNumber,
          +pageSize,
        );
      return { totalCount, totalPages: totalPage, data };
    } catch (error) {
      throw new BadRequestException('Cannot fetch latest listing', {
        cause: error,
      });
    }
  }

  @Get(':listingId')
  @UseInterceptors(CheckUserValidityInterceptor)
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiOkResponse({ type: ListingDetails })
  async getListingById(
    @Param() param: { listingId: string },
  ): Promise<ListingDetails> {
    try {
      const listing = await this.listingService.getListingById(param.listingId);
      return listing;
    } catch (error) {
      throw new NotFoundException('Cannot get listing', {
        cause: [error, { response: null }],
      });
    }
  }

  @Get('business/:listingid')
  @ApiParam({ name: 'listingid', type: 'string' })
  @UseInterceptors(CheckUserValidityInterceptor)
  @ApiOkResponse({ type: ListingModel })
  async getListingBusinessById(
    @Param() param: { listingid: string },
  ): Promise<ListingModel> {
    try {
      return await this.listingService.getListingBusinessById(param.listingid);
    } catch (error) {
      throw new NotFoundException('Cannot get listing', {
        cause: [error, { response: null }],
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('upload/images/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadListingImages(
    @Param() param: { listingId: string },
    // @UploadedFiles() images: Array<Express.Multer.File>,
    @ValidateImageFiles(['.png', '.jpg', '.jpeg']) validImages: Express.Multer.File[],
  ) {
    try {
      const imagesToSave = validImages.map((image) => {
        const uniquePrefix = uuidv4();
        return {
          ...image,
          originalname: `${uniquePrefix}-${image.originalname}`,
        };
      });
      try {
        imagesToSave.forEach(async (image) => {
          const createImageDto = new CreateImageFileDto();
          createImageDto.file = image;
          await validate(createImageDto);
        });
      } catch (error) {
        throw new BadRequestException('Cannot upload image', { cause: error });
      }

      const uploadedImages =
        await this.fileService.uploadFilesToBucket(imagesToSave);
      const imagesDtos = uploadedImages.map(
        (uploadedPdf: Express.Multer.File) => {
          const imageDto: CreateListingFilesDto = {
            fileName: uploadedPdf.originalname,
            filesSize: uploadedPdf.size,
            uploadDate: new Date(Date.now()),
          };
          return imageDto;
        },
      );
      return await this.fileService.addFilesToListing(
        param.listingId,
        imagesDtos,
        FilesType.IMAGE,
      );
    } catch (error) {
      throw new BadRequestException('Cannot upload image', { cause: error });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('upload/documents/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadListingPdfs(
    @UploadedFiles() pdfs: Express.Multer.File[],
    @Param() param: { listingId: string },
  ) {
    const pdfsToSave = pdfs.map((pdf) => {
      const uniquePrefix = uuidv4();
      return { ...pdf, originalname: `${uniquePrefix}-${pdf.originalname}` };
    });

    pdfsToSave.forEach(async (pdf) => {
      const createPdfDto = new CreatePdfFileDto();
      createPdfDto.file = pdf;
      const validation = await validate(createPdfDto);

      if (validation.length > 0) {
        throw new BadRequestException(
          validation[0].constraints.isFileExtension,
        );
      }
    });

    const uploadedPdfs = await this.fileService.uploadFilesToBucket(pdfsToSave);

    const pdfsDtos = uploadedPdfs.map((uploadedPdf: Express.Multer.File) => {
      const pdfDto: CreateListingFilesDto = {
        fileName: uploadedPdf.originalname,
        filesSize: uploadedPdf.size,
        uploadDate: new Date(Date.now()),
      };
      return pdfDto;
    });
    return await this.fileService.addFilesToListing(
      param.listingId,
      pdfsDtos,
      FilesType.PDF,
    );
  }

  @Get('latest/:number')
  @ApiParam({ name: 'number', type: 'string' })
  @UseInterceptors(CheckUserValidityInterceptor)
  async getLatestListings(
    @Param() param: { number: string },
  ): Promise<ListingOverview[]> {
    try {
      return await this.listingService.getLatestListings(+param.number);
    } catch (error) {
      throw new BadRequestException('Cannot fetch latest listing', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Put('update/isSold')
  @ApiQuery({ name: 'listingId', type: 'string' })
  @ApiCreatedResponse({ type: ListingOverview })
  async updateIsSold(
    @Query() { listingId }: { listingId: string },
    @Body() createListingDto: UpdateIsSold,
  ): Promise<void> {
    try {
      await this.listingService.updateIsSold(listingId, createListingDto);
    } catch (error) {
      throw new BadRequestException('Cannot update isSold', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Patch('update/listing/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiCreatedResponse({ type: ListingOverview })
  async updateListing(
    @Param() { listingId }: { listingId: string },
    @Body() createOrUpdateListingCommand: CreateOrUpdateListingCommand,
  ): Promise<ListingModel> {
    try {
      return await this.listingService.updateListing(
        listingId,
        createOrUpdateListingCommand,
      );
    } catch (error) {
      throw new BadRequestException('Cannot update listing', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Patch('update/financial/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiCreatedResponse({ type: ListingOverview })
  async updateFinancials(
    @Param() { listingId }: { listingId: string },
    @Body() createOrUpdateFinancialsDto: CreateOrUpdateFinancialCommand,
  ): Promise<UpdateFinancialModal> {
    try {
      return await this.financialService.updateFinancials(
        listingId,
        createOrUpdateFinancialsDto,
      );
    } catch (error) {
      throw new BadRequestException('Cannot update financials', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Patch('update/financial/previous-year/:financialId/:type')
  @ApiParam({ name: 'financialId', type: 'string' })
  @ApiParam({ name: 'type', type: 'string' })
  @ApiBody({ type: PreviousYearModel, isArray: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async updateFinancialPreviousYearByType(
    @Param('financialId') financialId: string,
    @Param('type') type: PreviousYearType,
    @Body() previousYears: PreviousYearModel[],
  ): Promise<void> {
    try {
      await this.financialService.updateFinancialPreviousYearByType({ financialId, type, previousYears });
    } catch (error) {
      throw new BadRequestException('Cannot update financial previous years by type', { cause: error });
    }
  }

  // Controller method for getFinancialPreviousYearsByType
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Get('financial/previous-years/:financialId/:type')
  @ApiParam({ name: 'financialId', type: 'string' })
  @ApiParam({ name: 'type', type: 'string' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PreviousYearModel, isArray: true })
  async getFinancialPreviousYearsByType(
    @Param('financialId') financialId: string,
    @Param('type') type: PreviousYearType,
  ): Promise<PreviousYearModel[]> {
    try {
      return await this.financialService.getFinancialPreviousYearsByType(financialId, type);
    } catch (error) {
      throw new BadRequestException('Cannot get financial previous years by type', { cause: error });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Delete('images/:listingId/:fileId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiParam({ name: 'fileId', type: 'string' })
  async deleteImage(
    @Param() { listingId, fileId }: { listingId: string; fileId: string },
  ): Promise<void> {
    try {
      await this.fileService.deleteImage(listingId, fileId);
    } catch (error) {
      throw new BadRequestException(error.message, {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Delete('pdfs/:listingId/:fileId')
  @ApiParam({ name: 'listingId', type: 'string' })
  @ApiParam({ name: 'fileId', type: 'string' })
  async deletePdf(
    @Param() { listingId, fileId }: { listingId: string; fileId: string },
  ): Promise<void> {
    try {
      await this.fileService.deletePdf(listingId, fileId);
    } catch (error) {
      throw new BadRequestException('Cannot delete file', {
        cause: error,
      });
    }
  }

  @Get('listing/financial/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  async getFinancialByListingId(@Param() { listingId }: { listingId: string }) {
    try {
      return await this.listingService.getFinancialByListingId(listingId);
    } catch (error) {
      throw new BadRequestException('Cannot get financial', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Get('listing/documents/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  async getDocumentsByListingId(@Param() { listingId }: { listingId: string }) {
    try {
      return await this.fileService.getFilesByListingId(listingId);
    } catch (error) {
      throw new BadRequestException('Cannot fetch files', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('listing/contact/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  async contactListingOwner(
    @CurrentUser() currentUser,
    @Param() { listingId }: { listingId: string },
  ) {
    try {
      return await this.listingService.contactListingOwner(
        currentUser.id,
        listingId,
      );
    } catch (error) {
      throw new BadRequestException('Cannot contact listing owner', {
        cause: error,
      });
    }
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  @Post('listing/sendForApproval/:listingId')
  @ApiParam({ name: 'listingId', type: 'string' })
  async sendForApproval(@Param("listingId") listingId: string) {
    try {
      console.log('ListingController.sendForApproval',listingId);
      return await this.listingService.sendForApproval(listingId);
    } catch (error) {
      throw new BadRequestException('Cannot approve listing', {
        cause: error,
      });
    }
  }

  @Get('listing/admin/approve')
  @ApiQuery({ name: 'token', type: 'string' })
  @ApiQuery({ name: 'action', type: 'boolean' })
  @ApiQuery({ name: 'rejectionReason', type: 'string' })
  async approveListing(
    @Query('token') token: string,
    @Query('action', new ParseBoolPipe()) action: boolean,
    @Query('rejectionReason') rejectionReason: string
  ) {
    try {
      const jwtData = await this.jwtService.verify(token, {
        ignoreExpiration: true,
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });
      const verificationResult = await this.listingService.verifyApprovalToken(
        jwtData.listingId,
        token,
      );
      if (!verificationResult)
        throw new JsonWebTokenError('Cannot Approve Token');
      await this.listingService.updateIsApproved(jwtData.listingId, action, rejectionReason);
      const listing = await this.listingService.getListingById(jwtData.listingId);
      const owner = await this.listingService.getListingOwnerId(listing.ownerId)

      if (action) {
        this.eventEmitter.emit(EVENTS.BUSINESS_PROFILE_APPROVED, {
          email: owner.email,
          name: `${owner.firstName ?? ""} ${owner.lastName ?? ""}`,
          businessName: listing.organizationName,
          businessId: listing.id,
        });
        return `The listing has been approved`;
      } else {
        this.eventEmitter.emit(EVENTS.BUSINESS_PROFILE_REJECTED, {
          email: owner.email,
          name: `${owner?.firstName ?? ""} ${owner?.lastName ?? ""}`,
          businessName: listing.organizationName,
          businessId: listing.id,
          reason: listing.rejectionReason ?? "no reason provided",
        });
        return `The listing has been denied`;
      }
    } catch (e) {
      if (e instanceof JsonWebTokenError) {
        throw new UnauthorizedException();
      }
      throw new BadRequestException('Cannot approve listing', {
        cause: e,
      });
    }
  }
}
