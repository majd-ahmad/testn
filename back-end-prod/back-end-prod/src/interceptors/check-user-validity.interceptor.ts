import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Injectable,
} from '@nestjs/common';
import { from, lastValueFrom, Observable } from 'rxjs';
import { ListingOverview } from '../app/listing/model/ListingOverview';
import { AccountService } from '../app/account/application/account.service';
import { ListingDetails } from '../app/listing/model/ListingDetails';
import {ListingModel} from "../app/listing/model/ListingModel";

@Injectable()
export class CheckUserValidityInterceptor implements NestInterceptor {
  constructor(readonly accountService: AccountService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const data = await lastValueFrom(handler.handle());
    if (data instanceof ListingDetails || data instanceof ListingModel) {
      const owner = await this.accountService.getAccountById(data.ownerId);
      const modifiedData = { ...data, isUserValid: owner.isValid }; // Add the isUserValid property
      return from([modifiedData]);
    }

    const dataToMap = data.data ?? data;
    const mappedData = dataToMap.map(async (item: ListingOverview) => {
      const owner = await this.accountService.getAccountById(item.ownerId);
      return { ...item, isUserValid: owner.isValid };
    });

    return new Observable((observer) => {
      Promise.all(mappedData)
        .then((result) => {
          let observableResult;
          if (data.data)
            observableResult = { totalPages: data.totalPages, data: result };
          else observableResult = result;
          observer.next(observableResult);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
