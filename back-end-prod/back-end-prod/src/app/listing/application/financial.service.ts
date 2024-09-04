import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IListingRepository,
  IListingRepositoryToken,
} from '../infrastructure/IListingRepository';
import { CreateOrUpdateFinancialCommand } from '../model/CreateOrUpdateFinancialsCommand.dto';
import { UpdateFinancialModal } from '../model/UpdateFinancialModal';
import { FinancialModel } from '../model/FinancialModel';
import { PreviousYearModel, PreviousYearType } from '../model/previousYear/previousYear.model';

@Injectable()
export class FinancialService {
  constructor(
    @Inject(IListingRepositoryToken)
    readonly listingRepository: IListingRepository,
  ) { }

  async addFinancialInformation(
    listingId: string,
    createFinancialDto: CreateOrUpdateFinancialCommand,
  ): Promise<FinancialModel> {
    try {
      const listingDomain = await this.listingRepository.addFinancial(
        listingId,
        createFinancialDto,
      );
      return FinancialModel.fromDomain(listingDomain);
    } catch (error) {
      throw new BadRequestException('Could not init listing', { cause: error });
    }
  }

  async updateFinancials(
    listingId: string,
    updateFinancialsDto: CreateOrUpdateFinancialCommand,
  ): Promise<UpdateFinancialModal> {
    try {
      const financial = await this.listingRepository.updateFinancial(
        listingId,
        updateFinancialsDto,
      );
      return UpdateFinancialModal.fromDomain(financial);
    } catch (error) {
      console.log(error);
    }
  }
  async updateFinancialPreviousYearByType(data: {
    financialId: string,
    type: PreviousYearType,
    previousYears: PreviousYearModel[]
  }): Promise<void> {
    try {
      return this.listingRepository.updateFinancialPreviousYearByType(data)
    } catch (error) {
      console.log(error);
    }
  }
  async getFinancialPreviousYearsByType(financialId: string, type: PreviousYearType): Promise<PreviousYearModel[]> {
    try {
      return this.listingRepository.getFinancialPreviousYearsByType(financialId, type)
    } catch (error) {
      console.log(error);
    }
  }
}
