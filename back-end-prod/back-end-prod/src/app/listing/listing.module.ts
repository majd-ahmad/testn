import { Logger, Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { IListingRepositoryToken } from './infrastructure/IListingRepository';
import { ListingRepository } from './infrastructure/ListingRepository';
import { ListingService } from './application/listing.service';
import { ListingController } from './listing.controller';
import { FileUploadModule } from '../../libs/file-upload/file-upload.module';
import { FilesService } from './application/files.service';
import { FinancialService } from './application/financial.service';
import { ImageFileExtensionValidator } from './validators/image-files-extension.validator';
import { PdfFileExtensionValidator } from './validators/pdf-files-extension.validator';
import { AccountModule } from '../account/account.module';
import { ContactSellerEvent } from './events/ContactSellerEvent';
import { EmailService, IEmailtoken } from '../../libs/email';
import { SendForApprovalEvent } from './events/SendForApprovalEvent';
import { ListingApprovalTokenService } from './application/listingApprovalToken.service';
import { IListingApprovalTokenRepositoryToken } from './infrastructure/IListingApprovalTokenRepository';
import { ListingApprovalTokenRepository } from './infrastructure/ListingApprovalTokenRepository';
import { BusinessProfileSubmittedEvent } from './events/BusinessProfileSubmittedEvent';
import { BusinessProfileApprovedEvent } from './events/BusinessProfileApprovedEvent';
import { BusinessProfileRejectedEvent } from './events/BusinessProfileRejectedEvent';

const events = [
  ContactSellerEvent,
  SendForApprovalEvent,
  BusinessProfileSubmittedEvent,
  BusinessProfileApprovedEvent,
  BusinessProfileRejectedEvent
];
@Module({
  imports: [DatabaseModule, FileUploadModule, AccountModule],
  controllers: [ListingController],
  providers: [
    ...events,
    Logger,
    ListingService,
    FilesService,
    FinancialService,
    ListingApprovalTokenService,
    ImageFileExtensionValidator,
    PdfFileExtensionValidator,
    {
      provide: IListingRepositoryToken,
      useClass: ListingRepository,
    },
    {
      provide: IListingApprovalTokenRepositoryToken,
      useClass: ListingApprovalTokenRepository,
    },
    { provide: IEmailtoken, useClass: EmailService },
  ],
  exports: [
    ListingService,
    {
      provide: IListingRepositoryToken,
      useClass: ListingRepository,
    },
  ],
})
export class ListingModule { }
